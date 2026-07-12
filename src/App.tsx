import { useState, useEffect } from 'react';
import './App.css';
import Dashboard from './features/Dashboard/Dashboard';
import supabase from './services/supabase';

function App() {
    // const [session, setSession] = useState<Session | null>;
    // const [loading, setLoading] = useState(true);
    // /*  loading === true → render a loading indicator.
    //     loading === false && session === null → render login.
    //     loading === false && session !== null → render dashboard.
    // */
    // function useSession() {
    //     async function getSession() {
    //         try {
    //             setSession(supabase.auth.getSession());
    //         } catch (err) {
    //             console.error(`Couldn't get the session`, err);
    //         }
    //     }
    // }
    return (
        <>
            <Dashboard></Dashboard>
        </>
    );
}

export default App;
