import { useState } from 'react';

import supabase from '../../services/supabase';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignIn = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        try {
            setLoading(true);
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (error) throw error;
        } catch (error) {
            setError('Invalid credentials. Please try again.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center w-auto mt-5">
            <form className="flex flex-col border-white border-2 p-6 rounded-lg">
                <p className="mb-5 text-center font-bold ">Please Sign In</p>
                <label htmlFor="email">E-mail</label>
                <input
                    type="text"
                    name="email"
                    id="email"
                    className="bg-white rounded-full text-center"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <label htmlFor="password">Password</label>
                <input
                    type="password"
                    name="password"
                    id="password"
                    className="bg-white rounded-full text-center "
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button
                    type="submit"
                    className="bg-black cursor-pointer hover:bg-gray-500 text-white rounded-full text-center mt-5 w-auto"
                    onClick={handleSignIn}
                    disabled={loading}
                >
                    login
                </button>
                {error && <p>{error}</p>}
            </form>
        </div>
    );
}

export default Login;
