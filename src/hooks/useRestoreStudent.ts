import { useState } from 'react';
import supabase from '../services/supabase';

// Restoring an archived student sets is_active = true (admin only, enforced by RLS)
function useRestoreStudent(refetchStudents: () => void) {
    const [restoreStudentError, setRestoreStudentError] = useState('');
    const [restoringStudentId, setRestoringStudentId] = useState<number | null>(
        null,
    );

    async function handleRestoreStudent(studentId: number) {
        try {
            setRestoringStudentId(studentId);
            setRestoreStudentError('');

            const { data, error } = await supabase
                .from('students')
                .update({ is_active: true })
                .eq('id', studentId)
                .select();

            if (error) {
                console.error(error);
                setRestoreStudentError(
                    'Student could not be restored. please try again',
                );
                return;
            }
            // RLS blocks an UPDATE silently (0 rows, no error)
            if (!data || data.length === 0) {
                setRestoreStudentError('Only admins can restore students.');
                return;
            }
            refetchStudents();
        } catch (err) {
            console.error(err);
        } finally {
            setRestoringStudentId(null);
        }
    }

    return { restoreStudentError, restoringStudentId, handleRestoreStudent };
}

export default useRestoreStudent;
