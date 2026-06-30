import { useState } from 'react';

import './App.css';
import supabase from './services/supabase';

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

    const payload: Payload = {
        category_id: 1,
        student_id: 1,
        term_id: 1,
        user_id: 1,
        level: rating,
    };

    async function handleRating(e) {
        e.preventDefault();
        const { data, error } = await supabase
            .from('ratings')
            .insert(payload)
            .select();

        if (error) {
            console.error(error);
            setError(`Rating could not be saved. Please Try again`);
            throw new Error(`Rating could not be saved. Please Try again`);
        }
    }

    return (
        <div className="flex justify-center items-center w-auto mt-5">
            <form action="">
                <h2>submit a rating</h2>
                <label htmlFor="rating">choose your rating</label>
                <br></br>
                <button
                    value={1}
                    onClick={() => {
                        setRating(1);
                    }}
                    name="rating"
                    className="bg-red-500 rounded-md w-auto m-2 p-2 border-2 border-black"
                >
                    1
                </button>
                <button
                    onClick={() => {
                        setRating(2);
                    }}
                    value={2}
                    name="rating"
                    className="bg-yellow-500 rounded-md w-auto m-2 p-2 border-2 border-black"
                >
                    2
                </button>
                <button
                    onClick={() => {
                        setRating(3);
                    }}
                    value={3}
                    name="rating"
                    className="bg-green-500 rounded-md w-auto m-2 p-2 border-2 border-black"
                >
                    3
                </button>
                <button
                    onClick={() => {
                        setRating(4);
                    }}
                    value={4}
                    name="rating"
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

                {!error ? (
                    <ErrorMessage message={error} />
                ) : (
                    <SuccessMessage message={'Saved rating'} />
                )}
            </form>
        </div>
    );
}

function ErrorMessage({ message }: { message: string }) {
    return <span className="text-red-500">{message}</span>;
}
function SuccessMessage({ message }: { message: string }) {
    return <span className="text-green-500">{message}</span>;
}

export default App;
