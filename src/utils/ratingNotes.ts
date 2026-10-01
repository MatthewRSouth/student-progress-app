import { type Rating } from '../types';

export type NotedRating = Rating & { note: string };

// The single source of per-criterion notes: ratings that were saved with a note, newest first.
// Both the profile card's "latest note" and the score modal's "earlier notes" read from this.
export function getNotedRatingsNewestFirst(ratings: Rating[]): NotedRating[] {
    return ratings
        .filter(
            (rating): rating is NotedRating =>
                typeof rating.note === 'string' && rating.note.trim() !== '',
        )
        .sort(
            (newerRating, olderRating) =>
                new Date(olderRating.created_at).getTime() -
                new Date(newerRating.created_at).getTime(),
        );
}
