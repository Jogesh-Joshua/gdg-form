import type { Announcement } from '../hooks/registrationReducer';

/**
 * Screen readers skip a live-region update whose text is unchanged, so repeated
 * messages alternate a trailing no-break space to force a new announcement.
 */
export function LiveRegion({ announcement }: { announcement: Announcement }) {
  return (
    <div className="sr-only" role="status" aria-atomic="true">
      {announcement.text}
      {announcement.seq % 2 === 0 ? '' : '\u00a0'}
    </div>
  );
}
