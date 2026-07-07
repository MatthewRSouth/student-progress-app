import DashboardHeaders from './DashboardHeaders';
import StudentList from './StudentList';
import ScoreModal from '../ScoreModal/ScoreModal';
import useFetch from '../../hooks/useFetch';
import { useMemo, useState } from 'react';
import supabase from '../../services/supabase';

//types
type Category = { id: number; criteria: string };
type Student = { id: number; name: string };
type Rating = {
    student_id: number;
    category_id: number;
    level: number;
    created_at: string;
};
// types
type Payload = {
    category_id: number;
    student_id: number;
    term_id: number;
    user_id: number;
    level: number;
};

function Dashboard() {
    const [rating, setRating] = useState(0);
    const [error, setError] = useState('');
    const [status, setStatus] = useState('idle'); //'idle', 'success', 'error'
    const [activeCell, setActiveCell] = useState<{
        studentId: number;
        categoryId: number;
    } | null>(null);

    const {
        data: ratings,
        error: ratingsError,
        refetch: refetchRatings,
    } = useFetch<Rating>(
        'ratings',
        'student_id, category_id, level, created_at ',
    );

    async function handleRating(e: React.MouseEvent<HTMLButtonElement>) {
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
        refetchRatings();
        setActiveCell(null);
        setRating(0);
    }

    const { data: categories, error: categoriesError } = useFetch<Category>(
        'categories',
        'id, criteria',
    );
    const { data: students, error: studentsError } = useFetch<Student>(
        'students',
        'id, name',
    );
    // const { data: ratings, error: ratingsError } = useFetch<Rating>(
    //     'ratings',
    //     'student_id, category_id, level, created_at',
    // );

    const ratingLookup = useMemo(() => {
        const result: Record<string, Rating> = {};
        for (const rating of ratings) {
            const key = `${rating.student_id}-${rating.category_id}`;
            if (!result[key] || rating.created_at > result[key].created_at) {
                result[key] = rating;
            }
        }
        return result;
    }, [ratings]);

    if (categoriesError || studentsError || ratingsError) {
        return <p>There was an error loading the dashboard.</p>;
    }

    return (
        <div className="grid grid-cols-[200px_repeat(4,112px)] text-center">
            <DashboardHeaders categories={categories}></DashboardHeaders>
            <StudentList
                students={students}
                categories={categories}
                ratingsLookup={ratingLookup}
                activeCell={activeCell}
                onActiveCell={(studentId, categoryId) =>
                    setActiveCell({ studentId, categoryId })
                }
            ></StudentList>
            {activeCell && (
                <ScoreModal
                    onSetRating={setRating}
                    onHandleRating={handleRating}
                    status={status}
                    errorMessage={error}
                ></ScoreModal>
            )}
        </div>
    );
}

export default Dashboard;
