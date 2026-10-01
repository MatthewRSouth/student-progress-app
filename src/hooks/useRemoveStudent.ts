import { useState } from 'react';
import supabase from '../services/supabase';

// Students are never deleted: "removing" one sets is_active = false (admin only, enforced by RLS).
// They can be restored from the Archived tab on the dashboard.
function useRemoveStudent() {
    const [studentArchived, setStudentArchived] = useState(false);
    const [removeStudentError, setRemoveStudentError] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleRemoveStudent(studentId: number) {
        try {
            setLoading(true);
            setRemoveStudentError('');

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
            // RLS blocks an UPDATE silently (0 rows, no error)
            if (!data || data.length === 0) {
                setRemoveStudentError('Only admins can remove students.');
                return;
            }
            setStudentArchived(true);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    return { studentArchived, removeStudentError, handleRemoveStudent, loading };
}

export default useRemoveStudent;
