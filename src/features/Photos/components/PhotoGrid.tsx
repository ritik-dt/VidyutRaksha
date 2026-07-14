import { PhotoCard } from './PhotoCard'
import type { Photo } from '../types'

interface PhotoGridProps {
  photos: Photo[]
  onCardClick?: (p: Photo) => void
}

/** "Photo evidence — recent uploads" card with a responsive grid of photo cards. */
export function PhotoGrid({ photos, onCardClick }: PhotoGridProps) {
  return (
    <div className="card">
      <div className="card-title">Photo evidence — recent uploads</div>
      {photos.length === 0 ? (
        <div className="px-4 py-9 text-center text-[13px] text-text-dim">
          <div className="mb-2 text-[32px] opacity-50">📷</div>
          <div className="font-semibold text-text-mid">No photos in this view</div>
          <div className="mt-1 text-[11px]">Try a different filter or clear the current one</div>
        </div>
      ) : (
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {photos.map((p) => (
            <PhotoCard key={p.id} photo={p} onClick={onCardClick} />
          ))}
        </div>
      )}
    </div>
  )
}
