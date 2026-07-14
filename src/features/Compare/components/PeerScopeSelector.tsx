import { PEER_SCOPE_OPTIONS } from '../data/peerData'
import type { PeerFeeder, PeerScopeId } from '../types'

interface PeerScopeSelectorProps {
  peerScope: PeerScopeId
  onPeerScopeChange: (id: PeerScopeId) => void
  selectedPeers: PeerFeeder[]
  onRemovePeer: (id: string) => void
}

/**
 * Select entities to compare — matches screenshot 1 exactly:
 * SCOPE: <dropdown>   SELECT 2-5 ITEMS: <chip x> <chip x> …
 */
export function PeerScopeSelector({
  peerScope,
  onPeerScopeChange,
  selectedPeers,
  onRemovePeer,
}: PeerScopeSelectorProps) {
  return (
    <div className="card">
      <div className="card-title">Select entities to compare</div>
      <div className="my-2.5 flex flex-wrap items-center gap-2.5 max-md:flex-col max-md:items-stretch">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-text-dim">
          Scope:
        </div>
        <select
          value={peerScope}
          onChange={(e) => onPeerScopeChange(e.target.value as PeerScopeId)}
          className="form-select"
          style={{ padding: '6px 10px', fontSize: 12, minWidth: 140 }}
        >
          {PEER_SCOPE_OPTIONS.map((o) => (
            <option key={o.id} value={o.id}>{o.label}</option>
          ))}
        </select>

        <div className="text-[11px] font-semibold uppercase tracking-wider text-text-dim max-md:mt-2 md:ml-2.5">
          Select 2-5 items:
        </div>
        <div className="flex flex-wrap gap-1">
          {selectedPeers.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => onRemovePeer(p.id)}
              className="rounded-[12px] px-2.5 py-[3px] text-[11px] font-semibold text-white transition-opacity hover:opacity-85"
              style={{ background: 'var(--ai-purple)' }}
              title={`Remove ${p.name} from comparison`}
            >
              {p.name} ✕
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
