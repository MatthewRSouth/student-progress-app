import { useState } from 'react';
import supabase from '../services/supabase';

// types
type Payload = {
    category_id: number;
    student_id: number;
    term_id: number;
    user_id: string;
    level: number;
};

function useRateStudent(refetchRatings: () => void, onSuccess: () => void) {
    //State Variables
    const [rating, setRating] = useState(0);
    const [error, setError] = useState('');
    const [status, setStatus] = useState('idle'); //'idle', 'success', 'error'

    async function handleRating(
        e: React.MouseEvent<HTMLButtonElement>,
        activeCell: { studentId: number; categoryId: number } | null,
        termId: number | null,
        userId: string | null,
    ) {
        //This handler creates the payload and inserts the payload into supabase.
        e.preventDefault();
        //if no rating guard
        if (rating === 0) {
            setError('Please pick a level');
            setStatus('error');
            return;
        }
        if (activeCell === null) {
            setError('Please pick a cell');
            setStatus('error');
            return;
        }
        if (termId === null) {
            setError('Please pick a term');
            setStatus('error');
            return;
        }
        if (userId === null) {
            setError('Please sign in');
            setStatus('error');
            return;
        }
        //set payload
        const payload: Payload = {
            category_id: activeCell.categoryId,
            student_id: activeCell.studentId,
            term_id: termId,
            user_id: userId,
            level: rating,
        };

        const { error } = await supabase
            .from('ratings')
            .insert(payload)
            .select();

        if (error) {
            console.error(error);
            setError(`Rating could not be saved. Please Try again`);
            setStatus('error');
            return;
        }

        setStatus('success');
        onSuccess();
        refetchRatings();
        setRating(0);
    }

    return { rating, setRating, status, setStatus, error, handleRating };
}
export default useRateStudent;
