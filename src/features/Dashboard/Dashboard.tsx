//React Hooks
import { useMemo, useState } from 'react';

//Custom Hooks
import useFetch from '../../hooks/useFetch';
import useRateStudent from '../../hooks/useRateStudent';

//Component Imports
import DashboardHeaders from './DashboardHeaders';
import StudentList from './StudentList';
import ScoreModal from '../ScoreModal/ScoreModal';
import Tabs from './Tabs';

//service imports
import supabase from '../../services/supabase';

//types
import {
    type Rating,
    type Category,
    type Student,
    type Term,
    type Class,
} from '../../types';
type DashboardProps = {
    userId: string;
};

function Dashboard({ userId }: DashboardProps) {
    //State vars
    const [selectedTermId, setSelectedTermId] = useState<number | null>(null);

    const [selectedClassId, setSelectedClassId] = useState<number | null>(1);

    const [activeCell, setActiveCell] = useState<{
        studentId: number;
        categoryId: number;
    } | null>(null);

    //Supabase Fetches
    const { data: categories, error: categoriesError } = useFetch<Category>(
        'categories',
        'id, criteria, class_id',
    );
    const { data: students, error: studentsError } = useFetch<Student>(
        'students',
        'id, name, class_id',
    );
    const { data: terms, error: termsError } = useFetch<Term>(
        'terms',
        'id, term',
    );
    const { data: classes, error: classesError } = useFetch<Class>(
        'classes',
        'id,name',
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
    const onSelectClass = (id: number) => {
        setSelectedClassId(id);
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

    const handleSignOut = async () => {
        await supabase.auth.signOut();
    };

    if (
        categoriesError ||
        studentsError ||
        ratingsError ||
        termsError ||
        classesError
    ) {
        return <p>There was an error loading the dashboard.</p>;
    }

    const visibleStudents = students.filter(
        (s) => s.class_id === selectedClassId,
    );
    const visibleCategories = categories.filter(
        (c) => c.class_id === selectedClassId,
    );
    return (
        <>
            <div className="flex w-full justify-end ">
                <button
                    className="mr-5 my-5 p-3 bg-black text-white text-center rounded-lg cursor-pointer hover:bg-gray-500"
                    onClick={handleSignOut}
                >
                    logout
                </button>
            </div>
            {/* Navigation */}
            <Tabs
                selectedClassId={selectedClassId}
                classes={classes}
                onSelectClass={onSelectClass}
            ></Tabs>
            <div className="flex flex-col justify-center items-center">
                <select
                    value={selectedTermId ?? ''}
                    onChange={(e) => setSelectedTermId(Number(e.target.value))}
                >
                    <option value="">Select a term</option>
                    {terms.map((term) => (
                        <option key={term.id} value={term.id}>
                            {term.term}
                        </option>
                    ))}
                </select>
                <div className="flex justify-start items-center bg-white w-[90vw] rounded-lg mt-4 p-2">
                    <div
                        className="grid text-center w-full"
                        style={{
                            gridTemplateColumns: `200px repeat(${visibleCategories.length}, minmax(0,1fr))`,
                        }}
                    >
                        <DashboardHeaders
                            categories={visibleCategories}
                        ></DashboardHeaders>
                        <StudentList
                            students={visibleStudents}
                            categories={visibleCategories}
                            ratingsLookup={ratingLookup}
                            activeCell={activeCell}
                            onActiveCell={(studentId, categoryId) =>
                                setActiveCell({ studentId, categoryId })
                            }
                        ></StudentList>
                        {activeCell && (
                            <ScoreModal
                                onSetRating={setRating}
                                onHandleRating={(e) =>
                                    handleRating(
                                        e,
                                        activeCell,
                                        selectedTermId,
                                        userId,
                                    )
                                }
                                status={status}
                                errorMessage={error}
                            ></ScoreModal>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Dashboard;
