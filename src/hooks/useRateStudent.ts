import { useState } from 'react';
import supabase from '../services/supabase';

// types
type Payload = {
    category_id: number;
    student_id: number;
    term_id: number;
    user_id: number;
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
        //set payload
        const payload: Payload = {
            category_id: activeCell.categoryId,
            student_id: activeCell.studentId,
            term_id: 1,
            user_id: 1,
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
