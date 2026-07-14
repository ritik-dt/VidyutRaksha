/** Legend row shown below the map — 7 asset types with colored dots. */
export function MapLegend() {
  return (
    <div className="map-legend-box">
      <div className="map-legend-item">
        <div className="map-legend-dot" style={{ background: '#0F2B46' }} />
        Feeder
      </div>
      <div className="map-legend-item">
        <div className="map-legend-dot" style={{ background: 'var(--green)' }} />
        DTR (low loss)
      </div>
      <div className="map-legend-item">
        <div className="map-legend-dot" style={{ background: 'var(--amber)' }} />
        DTR (mid loss)
      </div>
      <div className="map-legend-item">
        <div className="map-legend-dot" style={{ background: 'var(--red)' }} />
        DTR (high loss)
      </div>
      <div className="map-legend-item">
        <div
          className="map-legend-dot"
          style={{ background: 'var(--green)', width: 6, height: 6 }}
        />
        Consumer (safe)
      </div>
      <div className="map-legend-item">
        <div
          className="map-legend-dot"
          style={{ background: 'var(--red)', width: 6, height: 6 }}
        />
        Consumer (suspicious)
      </div>
      <div className="map-legend-item">
        <div
          className="map-legend-dot"
          style={{
            background: 'var(--red)',
            width: 8,
            height: 8,
            border: '2px solid #D4A017',
            boxSizing: 'border-box',
          }}
        />
        ✓ Real KVVNL meter
      </div>
    </div>
  )
}
