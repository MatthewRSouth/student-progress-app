import { useState } from 'react';
import supabase from '../services/supabase';

//Types
type Payload = {
    student_id: number;
    note: string;
    user_id: string;
};

function useAddObservation(refetchObservations: () => void) {
    const [noteText, setNoteText] = useState('');
    const [addObservationError, setAddObservationError] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleAddObservation(studentId: number, userId: string) {
        try {
            setLoading(true);
            setAddObservationError('');

            //No empty notes
            if (noteText.trim() === '') {
                setAddObservationError('Please write a note first');
                return;
            }

            //set payload
            const payload: Payload = {
                student_id: studentId,
                note: noteText.trim(),
                user_id: userId,
            };

            const { error } = await supabase
                .from('observations')
                .insert(payload)
                .select();

            if (error) {
                console.error(error);
                setAddObservationError(
                    'Note could not be saved. please try again',
                );
                return;
            }
            refetchObservations();
            setNoteText('');
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }
    return {
        noteText,
        setNoteText,
        addObservationError,
        handleAddObservation,
        loading,
    };
}

export default useAddObservation;
