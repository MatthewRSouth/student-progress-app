import { useEffect, useState } from 'react';
import supabase from '../../services/supabase';

function Dashboard() {
    const [data, setData] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    useEffect(function () {
        async function fetchCategories() {
            try {
                setLoading(true);
                const { data: categories, error } = await supabase
                    .from('categories')
                    .select('id, criteria');

                if (error) throw error;

                setData(categories);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        }
        fetchCategories();
    }, []);
    if (loading) {
        return <p>Loading...</p>;
    }
    if (error) {
        return <p>There was an error: {error}</p>;
    }
    return (
        <div className="flex justify-center items-center w-auto mt-5">
            <ul>
                {data.map((category) => (
                    <li key={category.id}>{category.criteria}</li>
                ))}
            </ul>
        </div>
    );
}

export default Dashboard;
