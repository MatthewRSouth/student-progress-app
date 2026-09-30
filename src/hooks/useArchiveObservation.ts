import { useState } from 'react';
import supabase from '../services/supabase';

// Notes are never deleted: "removing" one sets is_active = false (admin only, enforced by RLS)
function useArchiveObservation(refetchObservations: () => void) {
    const [archiveObservationError, setArchiveObservationError] = useState('');

    async function handleArchiveObservation(observationId: number) {
        try {
            setArchiveObservationError('');

            const { data, error } = await supabase
                .from('observations')
                .update({ is_active: false })
                .eq('id', observationId)
                .select();

            if (error) {
                console.error(error);
                setArchiveObservationError(
                    'Note could not be removed. please try again',
                );
                return;
            }
            // RLS blocks an UPDATE silently (0 rows, no error)
            if (!data || data.length === 0) {
                setArchiveObservationError('Only admins can remove notes.');
                return;
            }
            refetchObservations();
        } catch (err) {
            console.error(err);
        }
    }
    return { archiveObservationError, handleArchiveObservation };
}

export default useArchiveObservation;
