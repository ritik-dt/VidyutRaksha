import { useEffect, useRef } from 'react'
import L, { type LayerGroup, type Map as LeafletMap, type Marker, type TileLayer } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet.heat'
import type { DT, EnrichedFeeder, LayerVisibility, MapConsumer, NavContext } from '../types'
import type { RealMeter } from '../data/realMetersPool'
import { consumerStyle, dtMarkerHtml, dtTooltipHtml, feederMarkerHtml } from './mapMarkers'
import { generateConsumers } from '../logic/consumerGen'
import { useTheme } from '@/shared/context/ThemeContext'

interface MapContainerProps {
  feeders: EnrichedFeeder[]
  dts: DT[]
  layers: LayerVisibility
  onSelect: (ctx: NavContext) => void
  realMeters?: RealMeter[]
  navCtx?: NavContext
}

interface HeatLayer extends L.Layer {
  setLatLngs(pts: Array<[number, number, number]>): void
}

/**
 * Leaflet map — all 5 marker layer types + heatmap.
 * Layers are stored in refs so they can be toggled without rebuilding the whole map.
 */
export function MapContainer({ feeders, dts, layers, onSelect, realMeters = [], navCtx }: MapContainerProps) {
  const { theme } = useTheme()

  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<LeafletMap | null>(null)
  const tileLayerRef = useRef<TileLayer | null>(null)

  // Layer groups (created once, mutated on scope change)
  const feederLayerRef = useRef<LayerGroup | null>(null)
  const dtLayerRef = useRef<LayerGroup | null>(null)
  const consumerLayerRef = useRef<LayerGroup | null>(null)
  const linesLayerRef = useRef<LayerGroup | null>(null)
  const realLayerRef = useRef<LayerGroup | null>(null)
  const heatLayerRef = useRef<HeatLayer | null>(null)

  // Marker registry — id → marker (for pulse selection sync)
  const feederMarkersRef = useRef<Map<string, { marker: Marker; html: string; sz: number }>>(new Map())
  const dtMarkersRef = useRef<Map<string, { marker: Marker; html: string; sz: number }>>(new Map())
  const consumerMarkersRef = useRef<
    Map<string, { marker: L.CircleMarker; originalStyle: L.CircleMarkerOptions }>
  >(new Map())

  // Selection state — either a divIcon marker (feeder/DT) or a circleMarker (consumer/real meter)
  type IconSelection = {
    kind: 'icon'
    marker: Marker
    html: string
    sz: number
  }
  type CircleSelection = {
    kind: 'circle'
    marker: L.CircleMarker
    originalStyle: L.CircleMarkerOptions
  }
  const selectedRef = useRef<IconSelection | CircleSelection | null>(null)

  // Init map + tile layer + layer groups once
  useEffect(() => {
    const el = containerRef.current
    if (!el || mapRef.current) return

    const map = L.map(el, { zoomControl: true }).setView([25.327, 82.979], 14)
    mapRef.current = map

    // Tiles are added by the theme effect below, so they can swap light/dark live.

    feederLayerRef.current = L.layerGroup().addTo(map)
    dtLayerRef.current = L.layerGroup().addTo(map)
    consumerLayerRef.current = L.layerGroup().addTo(map)
    linesLayerRef.current = L.layerGroup().addTo(map)
    realLayerRef.current = L.layerGroup().addTo(map)

    return () => {
      map.remove()
      mapRef.current = null
      tileLayerRef.current = null
    }
  }, [])

  /**
   * Theme-matched basemap. The prototype picks its tile set at map-init from
   * `document.body.classList.contains('dark')` — CARTO ships matched light_all
   * and dark_all sets. React keeps the map mounted across a theme change, so we
   * swap the tile layer reactively instead of rebuilding the whole map.
   */
  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    const tileSet = theme === 'dark' ? 'dark_all' : 'light_all'

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current)
      tileLayerRef.current = null
    }

    tileLayerRef.current = L.tileLayer(
      `https://{s}.basemaps.cartocdn.com/${tileSet}/{z}/{x}/{y}{r}.png`,
      {
        attribution: '<a href="https://openstreetmap.org">OSM</a>+<a href="https://carto.com">CARTO</a>',
        maxZoom: 19,
        subdomains: 'abcd',
      },
    )
    tileLayerRef.current.addTo(map)
  }, [theme])

  // Rebuild all markers whenever the scope (feeders/dts) changes
  useEffect(() => {
    const map = mapRef.current
    if (!map || !feederLayerRef.current || !dtLayerRef.current || !consumerLayerRef.current || !linesLayerRef.current || !realLayerRef.current) return

    // Clear previous layers + registries
    feederLayerRef.current.clearLayers()
    dtLayerRef.current.clearLayers()
    consumerLayerRef.current.clearLayers()
    linesLayerRef.current.clearLayers()
    realLayerRef.current.clearLayers()
    feederMarkersRef.current.clear()
    dtMarkersRef.current.clear()
    consumerMarkersRef.current.clear()
    selectedRef.current = null

    // Feeders (navy pill) — register for pulse selection
    feeders.forEach((f) => {
      const html = feederMarkerHtml(f)
      const icon = L.divIcon({ className: '', html, iconSize: [28, 28], iconAnchor: [14, 14] })
      const marker = L.marker([f.lat, f.lng], { icon })
      marker.on('click', () => onSelect({ feeder: f, dt: null, consumer: null }))
      feederLayerRef.current!.addLayer(marker)
      feederMarkersRef.current.set(f.id, { marker, html, sz: 28 })
    })

    // DTs (color-coded) — register for pulse selection
    dts.forEach((dt) => {
      const { html, sz } = dtMarkerHtml(dt)
      const icon = L.divIcon({ className: '', html, iconSize: [sz, sz], iconAnchor: [sz / 2, sz / 2] })
      const marker = L.marker([dt.lat, dt.lng], { icon })
      marker.bindTooltip(dtTooltipHtml(dt), { direction: 'top', offset: [0, -sz / 2 - 2] })

      // Parent feeder: needed both for the "Back to {feeder}" button and the trunk line
      const parentFeeder = feeders.find((f) => f.id === dt.feeder) ?? null

      marker.on('click', () => {
        onSelect({ feeder: parentFeeder, dt, consumer: null })
      })
      dtLayerRef.current!.addLayer(marker)
      dtMarkersRef.current.set(dt.id, { marker, html, sz })

      // Trunk line: feeder → DT. Dashed teal, drawn into the toggleable 'lines' layer.
      if (parentFeeder) {
        linesLayerRef.current!.addLayer(
          L.polyline(
            [
              [parentFeeder.lat, parentFeeder.lng],
              [dt.lat, dt.lng],
            ],
            { color: '#17A2B8', weight: 1.5, opacity: 0.3, dashArray: '6 4' },
          ),
        )
      }
    })

    // Consumers — only render (flagged + every 8th normal) for perf
    const allConsumers: MapConsumer[] = generateConsumers(dts)
    const flagged = allConsumers.filter((c) => c.isTheft)
    const sample = allConsumers.filter((c) => !c.isTheft).filter((_, i) => i % 8 === 0)
    const renderable = [...flagged, ...sample]
    renderable.forEach((c) => {
      const style = consumerStyle(c.risk, c.isTheft, c.isCritical)
      const m = L.circleMarker([c.lat, c.lng], style)
      m.on('click', () => {
        const parentDt = dts.find((d) => d.id === c.dt) ?? null
        const parentFeeder = feeders.find((f) => f.id === c.feeder) ?? null
        onSelect({ feeder: parentFeeder, dt: parentDt, consumer: c })
      })
      consumerLayerRef.current!.addLayer(m)
      consumerMarkersRef.current.set(c.id, { marker: m, originalStyle: { ...style } })

      // Faint red spur: critical consumer → its parent DT. Only criticals get one.
      if (c.isCritical) {
        const parentDt = dts.find((d) => d.id === c.dt)
        if (parentDt) {
          linesLayerRef.current!.addLayer(
            L.polyline(
              [
                [parentDt.lat, parentDt.lng],
                [c.lat, c.lng],
              ],
              { color: '#DC3545', weight: 0.6, opacity: 0.18 },
            ),
          )
        }
      }
    })

    // Real KVVNL meters — gold-stroked circleMarkers placed near their affinity DTs
    if (realMeters.length > 0 && dts.length > 0) {
      const rsRng = (seed: number) => {
        let s = seed
        return () => {
          s = (s * 16807) % 2147483647
          return (s - 1) / 2147483646
        }
      }
      realMeters.forEach((rm, ri) => {
        // Pick a DT by activity affinity (matches prototype)
        const act = (rm.act || '').toLowerCase()
        let candidateDts = dts
        if (/factory|mill|loom|industrial/.test(act)) {
          candidateDts = dts.filter((d) => /Crossing|East|Bazaar|Station/i.test(d.area))
        } else if (/atta chakki|chakki|rice/.test(act)) {
          candidateDts = dts.filter((d) => d.loss > 18)
        } else if (/govt|hospital|college|bank/.test(act)) {
          candidateDts = dts.filter((d) => /Plaza|Main|East|Cantt/i.test(d.area))
        }
        if (candidateDts.length === 0) candidateDts = dts
        const rng = rsRng(ri * 7919 + 17)
        const anchor = candidateDts[Math.floor(rng() * candidateDts.length)]
        const angle = rng() * Math.PI * 2
        const dist = 0.0008 + rng() * 0.0028
        const lat = anchor.lat + Math.sin(angle) * dist
        const lng = anchor.lng + Math.cos(angle) * dist

        const cat: MapConsumer['cat'] = /factory|mill|loom|industrial|chakki|rice/.test(act)
          ? 'Industrial'
          : /govt|hospital|college|bank|shop/.test(act)
            ? 'Commercial'
            : 'Domestic'

        const realConsumer: MapConsumer = {
          id: rm.m,
          name: rm.name,
          cat,
          risk: rm.risk,
          drop: 0,
          events: rm.tcount,
          isTheft: rm.risk >= 70,
          isCritical: rm.risk >= 80,
          kwh: Math.round((rm.avg_kwh_d || 0) * 30),
          lat,
          lng,
          dt: anchor.id,
          feeder: anchor.feeder,
          sl: `${rm.load} ${rm.lu}`,
          theftType: rm.risk >= 70 ? 'Real MRI data flagged' : null,
          activity: rm.act,
          tariff: rm.tariff,
          zone: rm.zone,
          account: rm.acct,
          isReal: true,
          _ref: rm,
        }

        const color = rm.risk >= 70 ? '#DC3545' : rm.risk >= 40 ? '#E6921E' : '#28A745'
        const realStyle: L.CircleMarkerOptions = {
          radius: 6,
          fillColor: color,
          fillOpacity: 0.95,
          stroke: true,
          color: '#D4A017',
          weight: 2.5,
        }
        const m = L.circleMarker([lat, lng], realStyle)
        m.bindTooltip(
          `<div style="font-size:11px;line-height:1.4"><strong style="color:#D4A017">✓ REAL</strong> · ${(rm.name || '?').substring(0, 25)}<br><span style="color:#666;font-size:10px">M#${rm.m} · ${rm.act || '—'}</span></div>`,
          { direction: 'top', offset: [0, -8] },
        )
        m.on('click', () => {
          const parentDt = dts.find((d) => d.id === anchor.id) ?? null
          const parentFeeder = feeders.find((f) => f.id === anchor.feeder) ?? null
          onSelect({ feeder: parentFeeder, dt: parentDt, consumer: realConsumer })
        })
        realLayerRef.current!.addLayer(m)
        consumerMarkersRef.current.set(realConsumer.id, {
          marker: m,
          originalStyle: { ...realStyle },
        })
      })
    }

    // Center / fit bounds — matches prototype: single feeder → tight zoom;
    // multiple → fit bounds including BOTH feeders and DTs so nothing at the
    // scope edge gets clipped from the initial view.
    if (feeders.length === 0) {
      map.setView([26.85, 80.95], 7)
    } else if (feeders.length === 1) {
      map.setView([feeders[0].lat, feeders[0].lng], 15)
    } else {
      const points: L.LatLngExpression[] = [
        ...feeders.map((f) => [f.lat, f.lng] as [number, number]),
        ...dts.map((d) => [d.lat, d.lng] as [number, number]),
      ]
      const bounds = L.latLngBounds(points)
      map.fitBounds(bounds, { padding: [30, 30], maxZoom: 15 })
    }
  }, [feeders, dts, realMeters, onSelect])

  // Layer show/hide effect (runs whenever a toggle changes)
  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    const applyToggle = (group: LayerGroup | null, on: boolean) => {
      if (!group) return
      if (on) {
        if (!map.hasLayer(group)) map.addLayer(group)
      } else if (map.hasLayer(group)) {
        map.removeLayer(group)
      }
    }

    applyToggle(feederLayerRef.current, layers.feeders)
    applyToggle(dtLayerRef.current, layers.dts)
    applyToggle(consumerLayerRef.current, layers.consumers)
    applyToggle(linesLayerRef.current, layers.lines)
    applyToggle(realLayerRef.current, layers.real)
  }, [layers.feeders, layers.dts, layers.consumers, layers.lines, layers.real])

  // Marker selection pulse animation — sync to navCtx (feeder or dt selection).
  // Marker selection sync — mirrors prototype's selectMapMarker + selectCircleMarker.
  // Precedence: consumer > dt > feeder (deepest wins). Icon markers (feeder/DT) get
  // wrapped in .map-marker-selected-wrap for the cyan pulse; circleMarkers (consumer,
  // real meter) get setStyle with a cyan ring and boosted radius.
  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    // Restore previous selection first
    const prev = selectedRef.current
    if (prev) {
      try {
        if (prev.kind === 'icon') {
          const restoreIcon = L.divIcon({
            className: '',
            html: prev.html,
            iconSize: [prev.sz, prev.sz],
            iconAnchor: [prev.sz / 2, prev.sz / 2],
          })
          prev.marker.setIcon(restoreIcon)
        } else {
          prev.marker.setStyle(prev.originalStyle)
        }
      } catch {
        // ignore — marker may have been removed on scope change
      }
    }
    selectedRef.current = null

    if (!navCtx) return

    // 1. Consumer selection (highest precedence) — circleMarker via setStyle
    if (navCtx.consumer) {
      const entry = consumerMarkersRef.current.get(navCtx.consumer.id)
      if (entry) {
        try {
          const boostedRadius = (entry.originalStyle.radius || 5) + 4
          entry.marker.setStyle({
            radius: boostedRadius,
            stroke: true,
            color: '#38BDF8',
            weight: 3.5,
            fillOpacity: 1,
          })
          entry.marker.bringToFront()
          selectedRef.current = { kind: 'circle', marker: entry.marker, originalStyle: entry.originalStyle }
          const latlng = entry.marker.getLatLng()
          const currentZoom = map.getZoom()
          const targetZoom = Math.max(currentZoom, 16)
          map.flyTo(latlng, targetZoom, { duration: 0.6, easeLinearity: 0.5 })
        } catch {
          // ignore
        }
        return
      }
      // Fall through to DT/feeder highlight if consumer marker not registered
    }

    // 2. DT selection — divIcon via setIcon(wrappedHtml)
    // 3. Feeder selection — same divIcon path
    let target: { marker: Marker; html: string; sz: number } | undefined
    if (navCtx.dt) {
      target = dtMarkersRef.current.get(navCtx.dt.id)
    } else if (navCtx.feeder) {
      target = feederMarkersRef.current.get(navCtx.feeder.id)
    }

    if (target) {
      try {
        const wrappedHtml = `<div class="map-marker-selected-wrap" style="line-height:0">${target.html}</div>`
        const pulseIcon = L.divIcon({
          className: '',
          html: wrappedHtml,
          iconSize: [target.sz, target.sz],
          iconAnchor: [target.sz / 2, target.sz / 2],
        })
        target.marker.setIcon(pulseIcon)
        selectedRef.current = { kind: 'icon', marker: target.marker, html: target.html, sz: target.sz }
        const latlng = target.marker.getLatLng()
        const currentZoom = map.getZoom()
        // Prototype uses 14 for both feeder and DT selection (not tighter for DT).
        const targetZoom = Math.max(currentZoom, 14)
        map.flyTo(latlng, targetZoom, { duration: 0.6, easeLinearity: 0.5 })
      } catch {
        // ignore
      }
    }
  }, [navCtx])

  // Heatmap toggle
  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    if (layers.heat) {
      if (!heatLayerRef.current) {
        const pts: Array<[number, number, number]> = dts
          .filter((d) => (d.loss || 0) > 15)
          .map((d) => [d.lat, d.lng, (d.loss || 0) / 30])
        interface HeatFactory {
          heatLayer: (
            pts: Array<[number, number, number]>,
            opts: {
              radius: number
              blur: number
              maxZoom: number
              gradient: Record<number, string>
            },
          ) => HeatLayer
        }
        const withHeat = L as unknown as HeatFactory
        heatLayerRef.current = withHeat.heatLayer(pts, {
          radius: 35,
          blur: 25,
          maxZoom: 17,
          gradient: { 0.2: '#28A745', 0.5: '#E6921E', 0.8: '#DC3545', 1.0: '#7C3AED' },
        })
        heatLayerRef.current!.addTo(map)
      }
    } else if (heatLayerRef.current) {
      map.removeLayer(heatLayerRef.current)
      heatLayerRef.current = null
    }
  }, [layers.heat, dts])

  return (
    <div
      id="networkMap"
      ref={containerRef}
      className="flex-1 h-full w-full border-none rounded-none max-[900px]:!h-[420px] max-[900px]:!min-h-[420px] max-[640px]:!h-[360px] max-[640px]:!min-h-[360px] z-[1]"
    />
  )
}
