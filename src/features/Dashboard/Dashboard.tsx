import DashboardHeaders from './DashboardHeaders';
import StudentList from './StudentList';
import ScoreModal from '../ScoreModal/ScoreModal';
import useFetch from '../../hooks/useFetch';
import { useMemo, useState } from 'react';

//types
type Category = { id: number; criteria: string };
type Student = { id: number; name: string };
type Rating = {
    student_id: number;
    category_id: number;
    level: number;
    created_at: string;
};

function Dashboard() {
    const [activeCell, setActiveCell] = useState<{
        studentId: number;
        categoryId: number;
    } | null>(null);

    const { data: categories, error: categoriesError } = useFetch<Category>(
        'categories',
        'id, criteria',
    );
    const { data: students, error: studentsError } = useFetch<Student>(
        'students',
        'id, name',
    );
    const { data: ratings, error: ratingsError } = useFetch<Rating>(
        'ratings',
        'student_id, category_id, level, created_at',
    );

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
            {activeCell && <ScoreModal></ScoreModal>}
        </div>
    );
}

export default Dashboard;
