import { useState } from 'react';

import supabase from '../../services/supabase';

import hoshidaLogo from '../../assets/hoshida-icon-transparent.png';
import Illustration from './Illustration';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
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
        <div className="flex items-center flex-col md:flex-row md:justify-center">
            <div className="flex flex-col justify-center items-center mt-5 p-5 h-screen w-[50%] ">
                <div className="flex mx-4 mb-10">
                    <div className="flex items-center justify-center rounded-lg h-20 w-20 ">
                        <img
                            src={hoshidaLogo}
                            alt="Hoshida International Logo"
                        />
                    </div>
                    <div className="flex items-center justify-center flex-col mx-4">
                        <h1 className="font-bold text-center text-[40px]">
                            Progress Tracker
                        </h1>
                        <small>Hoshida International</small>
                    </div>
                </div>

                <form
                    className="flex flex-col justify-center items-center p-15 max-w-100 rounded-lg"
                    onSubmit={handleSignIn}
                >
                    <p className="mb-5 text-center font-bold text-2xl">Login</p>

                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        id="email"
                        className="bg-[#f0f0f0] rounded-lg p-2.5 mx-2 w-75 mb-5 border-2 border-teal-600"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        id="password"
                        className="bg-[#f0f0f0] rounded-lg p-2.5 mx-2 w-75 mb-5 border-2 border-teal-600"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                        type="submit"
                        className=" bg-teal-700 cursor-pointer hover:bg-teal-800 text-white rounded-lg p-2.5 text-center mt-5 w-75"
                        disabled={loading}
                    >
                        Login
                    </button>
                    {error && (
                        <p className="text-red-600 text-sm mt-2">{error}</p>
                    )}
                </form>
            </div>
            <div className="h-full w-full md:w-1/2">
                <Illustration></Illustration>
            </div>
        </div>
    );
}

export default Login;
