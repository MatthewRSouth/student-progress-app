//React Hooks
import { useState } from 'react';
//Custom Hooks
import useFetch from '../../hooks/useFetch';
import useRateStudent from '../../hooks/useRateStudent';
//Component Imports
import DashboardHeaders from './DashboardHeaders';
import StudentList from './StudentList';
import ScoreModal from '../ScoreModal/ScoreModal';
import Navigation from '../Navigation/Navigation';

import AddStudentModal from '../AddStudentModal/AddStudentModal';
import AddCriteriaModal from '../AddCriteriaModal/AddCriteriaModal';

//service imports
import supabase from '../../services/supabase';
//types
import {
    type Rating,
    type Category,
    type Student,
    type Term,
    type Cls,
} from '../../types';
import Terms from './Terms';
import useRatingLookup from '../../hooks/useRatingLookup';

type DashboardProps = {
    userId: string;
};

function Dashboard({ userId }: DashboardProps) {
    //State vars
    const [addStudentModal, setAddStudentModal] = useState(false);
    const [addCriteriaModal, setAddCriteriaModal] = useState(false);
    const [selectedTermId, setSelectedTermId] = useState<number | null>(null);
    const [selectedClassId, setSelectedClassId] = useState<number>(1);
    const [activeCell, setActiveCell] = useState<{
        studentId: number;
        categoryId: number;
    } | null>(null);

    //Supabase Fetches
    const {
        data: categories,
        error: categoriesError,
        refetch: refetchCriteria,
    } = useFetch<Category>('categories', 'id, criteria, class_id, is_active');
    const {
        data: students,
        error: studentsError,
        refetch: refetchStudents,
    } = useFetch<Student>('students', 'id, name, class_id,is_active');
    const { data: terms, error: termsError } = useFetch<Term>(
        'terms',
        'id, term, created_at',
    );
    const { data: classes, error: classesError } = useFetch<Cls>(
        'classes',
        'id,name',
    );

    const {
        data: ratings,
        error: ratingsError,
        refetch: refetchRatings,
    } = useFetch<Rating>(
        'ratings',
        'student_id, category_id, level, created_at, term_id',
    );

    //Helpers
    const onSuccess = () => {
        setActiveCell(null);
    };
    const onSelectClass = (id: number) => {
        setSelectedClassId(id);
    };
    const onAddStudentSucess = () => {
        setAddStudentModal(false);
    };
    const onAddCriteriaSucess = () => {
        setAddCriteriaModal(false);
    };

    //Custom Hook Uses
    const { setRating, rating, status, error, handleRating } = useRateStudent(
        refetchRatings,
        onSuccess,
    );

    //Memo to rate look up
    const ratingLookup = useRatingLookup(ratings);

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

    // Students and Categories Filter
    const visibleStudents = students.filter(
        (s) => s.class_id === selectedClassId && s.is_active,
    );
    const visibleCategories = categories.filter(
        (c) => c.class_id === selectedClassId && c.is_active,
    );

    //Current and Active Variables
    const mostRecentTerms = [...terms].sort((a: Term, b: Term) =>
        b.created_at.localeCompare(a.created_at),
    );
    const effectiveTermId = selectedTermId ?? mostRecentTerms[0]?.id;
    const activeStudent = students.find((s) => s.id === activeCell?.studentId);
    const activeCategory = categories.find(
        (c) => c.id === activeCell?.categoryId,
    );
    const activeClass = classes.find((cls) => cls.id === selectedClassId);
    const currentRating = activeCell
        ? ratingLookup[
              `${activeCell.studentId}-${activeCell.categoryId}-${effectiveTermId}`
          ]
        : undefined;
    return (
        <>
            <Navigation
                handleSignOut={handleSignOut}
                selectedClassId={selectedClassId}
                classes={classes}
                onSelectClass={onSelectClass}
                setAddCriteriaModal={setAddCriteriaModal}
                setAddStudentModal={setAddStudentModal}
            ></Navigation>
            <div className="flex flex-col justify-center items-center">
                <Terms
                    effectiveTermId={effectiveTermId}
                    selectedTermId={selectedTermId}
                    setSelectedTermId={setSelectedTermId}
                    terms={terms}
                />
                {/* Dashboard */}
                {visibleCategories.length === 0 &&
                visibleStudents.length === 0 ? (
                    <div className="justify-center items-center my-5 text-center">
                        <p className="font-bold text-xl">
                            Add Criteria or Add students to get started
                        </p>
                    </div>
                ) : (
                    <div className="flex justify-start items-center bg-white w-[95vw] rounded-lg mt-4 p-2">
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
                                termId={effectiveTermId}
                                students={visibleStudents}
                                categories={visibleCategories}
                                ratingsLookup={ratingLookup}
                                onActiveCell={(studentId, categoryId) =>
                                    setActiveCell({ studentId, categoryId })
                                }
                            ></StudentList>
                            {activeCell &&
                                activeStudent &&
                                activeCategory &&
                                activeClass && (
                                    <ScoreModal
                                        onClose={() => setActiveCell(null)}
                                        onSetRating={setRating}
                                        onHandleRating={(e) =>
                                            handleRating(
                                                e,
                                                activeCell,
                                                effectiveTermId,
                                                userId,
                                            )
                                        }
                                        student={activeStudent}
                                        category={activeCategory}
                                        studentClass={activeClass}
                                        status={status}
                                        errorMessage={error}
                                        currentRating={currentRating?.level}
                                        rating={rating}
                                    ></ScoreModal>
                                )}
                        </div>
                    </div>
                )}
                {addStudentModal && (
                    <AddStudentModal
                        refetchStudents={refetchStudents}
                        onAddStudentSuccess={onAddStudentSucess}
                        selectedClassId={selectedClassId}
                        onClose={() => setAddStudentModal(false)}
                    ></AddStudentModal>
                )}
                {addCriteriaModal && (
                    <AddCriteriaModal
                        refetchCriteria={refetchCriteria}
                        onAddCriteriaSuccess={onAddCriteriaSucess}
                        selectedClassId={selectedClassId}
                        onClose={() => setAddCriteriaModal(false)}
                    ></AddCriteriaModal>
                )}
            </div>
        </>
    );
}

export default Dashboard;
