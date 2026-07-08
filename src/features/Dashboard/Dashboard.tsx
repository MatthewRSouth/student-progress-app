//React Hooks
import { useMemo, useState } from 'react';

//Custom Hooks
import useFetch from '../../hooks/useFetch';
import useRateStudent from '../../hooks/useRateStudent';

//Component Imports
import DashboardHeaders from './DashboardHeaders';
import StudentList from './StudentList';
import ScoreModal from '../ScoreModal/ScoreModal';

//types
type Category = { id: number; criteria: string };
type Student = { id: number; name: string };
type Rating = {
    student_id: number;
    category_id: number;
    level: 1 | 2 | 3 | 4;
    created_at: string;
};

function Dashboard() {
    //State vars

    const [activeCell, setActiveCell] = useState<{
        studentId: number;
        categoryId: number;
    } | null>(null);

    //Supabase Fetches
    const { data: categories, error: categoriesError } = useFetch<Category>(
        'categories',
        'id, criteria',
    );
    const { data: students, error: studentsError } = useFetch<Student>(
        'students',
        'id, name',
    );

    const {
        data: ratings,
        error: ratingsError,
        refetch: refetchRatings,
    } = useFetch<Rating>(
        'ratings',
        'student_id, category_id, level, created_at ',
    );
    const onSuccess = () => {
        setActiveCell(null);
    };
    const { setRating, status, error, handleRating } = useRateStudent(
        refetchRatings,
        onSuccess,
    );

    //Memo to rate look up
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
        <div className="flex justify-center">
            <div className="flex justify-center items-center bg-white w-auto rounded-lg mt-4 p-2">
                <div className="grid grid-cols-[200px_repeat(4,112px)] text-center">
                    <DashboardHeaders
                        categories={categories}
                    ></DashboardHeaders>
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
                            onHandleRating={(e) => handleRating(e, activeCell)}
                            status={status}
                            errorMessage={error}
                        ></ScoreModal>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
