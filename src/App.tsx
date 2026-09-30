import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router';

import './App.css';
import Dashboard from './features/Dashboard/Dashboard';
import Login from './features/Login/Login';
import LoginLoader from './features/Login/LoginLoader';
import StudentProfile from './features/StudentProfile/StudentProfile';

import supabase from './services/supabase';
import type { Session } from '@supabase/supabase-js';

function App() {
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setLoading(false);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });
        //subscription clean up
        return () => {
            subscription.unsubscribe();
        };
    }, []);
    if (loading) return <LoginLoader>loading...</LoginLoader>;
    if (!session) return <Login />;
    return (
        <Routes>
            <Route path="/" element={<Dashboard userId={session.user.id} />} />
            <Route
                path="/students/:studentId"
                element={<StudentProfile userId={session.user.id} />}
            />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

export default App;
