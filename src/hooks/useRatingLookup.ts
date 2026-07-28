import { useMemo } from 'react';
import { type Rating } from '../types';

function useRatingLookup(ratings: Rating[]) {
    return useMemo(() => {
        const result: Record<string, Rating> = {};
        for (const rating of ratings) {
            const key = `${rating.student_id}-${rating.category_id}-${rating.term_id}`;
            if (!result[key] || rating.created_at > result[key].created_at) {
                result[key] = rating;
            }
        }
        return result;
    }, [ratings]);
}
export default useRatingLookup;
