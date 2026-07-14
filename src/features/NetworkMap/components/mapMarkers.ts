import type { DT, Feeder } from '../types'

/** Loss-based color for a DT (matches prototype's ternary). */
export function dtColor(loss: number): string {
  return loss > 20 ? '#DC3545' : loss > 15 ? '#E6921E' : '#28A745'
}

/** Feeder marker HTML — navy circle with F{last3} label. */
export function feederMarkerHtml(f: Feeder): string {
  const shortId = f.id.replace('Feeder-', 'F').slice(0, 5)
  return `<div style="width:28px;height:28px;border-radius:50%;background:#0F2B46;border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.3);display:flex;align-items:center;justify-content:center;color:#fff;font-size:8px;font-weight:700;font-family:IBM Plex Sans;cursor:pointer">${shortId}</div>`
}

/** DTR marker HTML — colored circle with flagged count + critical corner badge. */
export function dtMarkerHtml(dt: DT): { html: string; sz: number } {
  const color = dtColor(dt.loss || 0)
  const flagged = dt.flagged || 0
  const critical = dt.critical || 0
  const sz = Math.min(46, 22 + Math.sqrt(flagged) * 1.4)
  const ringStyle =
    critical > 20
      ? `box-shadow:0 0 0 2px #fff,0 0 0 4px ${color},0 0 14px ${color}80;`
      : critical > 5
        ? `box-shadow:0 0 0 2px #fff,0 0 8px ${color}50;`
        : `box-shadow:0 1px 4px ${color}40;`
  const criticalBadge =
    critical > 0
      ? `<div style="position:absolute;top:-4px;right:-4px;background:#fff;color:${color};border-radius:50%;width:16px;height:16px;display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:800;border:1.5px solid ${color};box-shadow:0 1px 3px rgba(0,0,0,0.3)">${critical}</div>`
      : ''
  const html = `<div style="width:${sz}px;height:${sz}px;border-radius:50%;background:${color};display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:IBM Plex Sans;color:#fff;cursor:pointer;${ringStyle}position:relative">
      <div style="font-size:${sz > 32 ? 12 : 10}px;font-weight:800;line-height:1">${flagged}</div>
      <div style="font-size:7.5px;font-weight:600;opacity:.9;letter-spacing:.3px;line-height:1">flagged</div>
      ${criticalBadge}
    </div>`
  return { html, sz }
}

/** DTR tooltip HTML. */
export function dtTooltipHtml(dt: DT): string {
  const color = dtColor(dt.loss || 0)
  const flagged = dt.flagged || 0
  const critical = dt.critical || 0
  return `<div style="font-size:11px;line-height:1.5"><strong>${dt.id}</strong> · ${dt.area}<br><span style="color:#666">${dt.meters} consumers · <strong style="color:${color}">${flagged} flagged</strong>${critical ? ' · <strong style="color:#DC3545">' + critical + ' critical</strong>' : ''}</span><br><span style="color:#666;font-size:10px">Loss: ${dt.loss}% · Load: ${dt.load}%</span></div>`
}

/** Consumer circleMarker style. */
export function consumerStyle(risk: number, isTheft: boolean, isCritical: boolean): {
  radius: number
  fillColor: string
  fillOpacity: number
  stroke: boolean
  color: string
  weight: number
} {
  const color =
    risk >= 80 ? '#DC3545' : risk >= 60 ? '#E6921E' : risk >= 40 ? '#F4A847' : '#28A745'
  const radius = isCritical ? 6 : isTheft ? 4.5 : 2
  return {
    radius,
    fillColor: color,
    fillOpacity: isTheft ? 0.85 : 0.35,
    stroke: isCritical || isTheft,
    color: isCritical ? '#7C0011' : color,
    weight: isCritical ? 2 : isTheft ? 1.2 : 0,
  }
}
