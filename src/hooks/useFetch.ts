import { useState, useEffect } from 'react';
import supabase from '../services/supabase';

function useFetch<T>(tableName: string, columns: string) {
    const [data, setData] = useState<T[]>([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    async function fetchData() {
        try {
            setLoading(true);
            const { data: result, error } = await supabase
                .from(tableName)
                .select(columns);
            if (error) throw error;

            setData(result as T[]);
        } catch (err) {
            const message =
                err instanceof Error ? err.message : 'Something went wrong';
            setError(message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, [tableName, columns]);

    return { data, loading, error, refetch: fetchData };
}

export default useFetch;
