import { useState } from 'react';
import supabase from './services/supabase';

import './App.css';
import ScoreModal from './features/ScoreModal/ScoreModal';
import Dashboard from './features/Dashboard/Dashboard';

// types
type Payload = {
    category_id: number;
    student_id: number;
    term_id: number;
    user_id: number;
    level: number;
};

function App() {
    const [rating, setRating] = useState(0);
    const [error, setError] = useState('');
    const [status, setStatus] = useState('idle'); //'idle', 'success', 'error'

    async function handleRating(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        //if no rating guard
        if (rating === 0) {
            setError('Please pick a level');
            setStatus('error');
            return;
        }
        //set payload
        const payload: Payload = {
            category_id: 1,
            student_id: 1,
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
    }

    return (
        <>
            <ScoreModal
                onSetRating={setRating}
                onHandleRating={handleRating}
                errorMessage={error}
                status={status}
            ></ScoreModal>
            <Dashboard></Dashboard>
        </>
    );
}

export default App;
