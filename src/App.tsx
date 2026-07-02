import { useState } from 'react';
import supabase from './services/supabase';

import './App.css';
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

        const { data, error } = await supabase
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
            <div className="flex justify-center items-center w-auto mt-5">
                <form action="">
                    <h2>submit a rating</h2>
                    <label htmlFor="rating">choose your rating</label>
                    <br></br>
                    <button
                        type="button"
                        onClick={() => {
                            setRating(1);
                        }}
                        className="bg-red-500 rounded-md w-auto m-2 p-2 border-2 border-black"
                    >
                        1
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setRating(2);
                        }}
                        className="bg-yellow-500 rounded-md w-auto m-2 p-2 border-2 border-black"
                    >
                        2
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setRating(3);
                        }}
                        className="bg-green-500 rounded-md w-auto m-2 p-2 border-2 border-black"
                    >
                        3
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setRating(4);
                        }}
                        className="bg-blue-500 rounded-md w-auto m-2 p-2 border-2 border-black"
                    >
                        4
                    </button>
                    <br></br>
                    <button
                        type="submit"
                        onClick={handleRating}
                        className="bg-black text-white rounded-md w-auto m-2 p-2 border-2 border-black"
                    >
                        Save Score
                    </button>

                    {status === 'success' ? (
                        <SuccessMessage message={'Saved rating'} />
                    ) : (
                        <ErrorMessage message={error} />
                    )}
                </form>
            </div>
            <Dashboard></Dashboard>
        </>
    );
}

function ErrorMessage({ message }: { message: string }) {
    return <span className="text-red-500">{message}</span>;
}
function SuccessMessage({ message }: { message: string }) {
    return <span className="text-green-500">{message}</span>;
}

export default App;
