import { useState } from 'react';
import supabase from '../services/supabase';

// 'deleted': row is gone (student had no history)
// 'archived': is_active = false (ratings or notes exist, so history is kept)
export type RemovalOutcome = 'deleted' | 'archived' | null;

const FOREIGN_KEY_VIOLATION = '23503';

function useRemoveStudent() {
    const [removalOutcome, setRemovalOutcome] = useState<RemovalOutcome>(null);
    const [removeStudentError, setRemoveStudentError] = useState('');
    const [loading, setLoading] = useState(false);

    async function archiveStudent(studentId: number) {
        const { data, error } = await supabase
            .from('students')
            .update({ is_active: false })
            .eq('id', studentId)
            .select();

        if (error) {
            console.error(error);
            setRemoveStudentError(
                'Student could not be removed. please try again',
            );
            return;
        }
        if (!data || data.length === 0) {
            setRemoveStudentError('Only admins can remove students.');
            return;
        }
        setRemovalOutcome('archived');
    }

    async function handleRemoveStudent(
        studentId: number,
        studentHasHistory: boolean,
    ) {
        try {
            setLoading(true);
            setRemoveStudentError('');

            if (studentHasHistory) {
                await archiveStudent(studentId);
                return;
            }

            const { data, error } = await supabase
                .from('students')
                .delete()
                .eq('id', studentId)
                .select();

            // A rating or note was added since the page loaded: keep the history instead
            if (error?.code === FOREIGN_KEY_VIOLATION) {
                await archiveStudent(studentId);
                return;
            }
            if (error) {
                console.error(error);
                setRemoveStudentError(
                    'Student could not be removed. please try again',
                );
                return;
            }
            if (!data || data.length === 0) {
                setRemoveStudentError('Only admins can remove students.');
                return;
            }
            setRemovalOutcome('deleted');
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    return { removalOutcome, removeStudentError, handleRemoveStudent, loading };
}

export default useRemoveStudent;
