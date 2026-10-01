//React Hooks
import { useState } from 'react';
import { useSearchParams } from 'react-router';
//Custom Hooks
import useFetch from '../../hooks/useFetch';
import useCriteriaLanguage from '../../hooks/useCriteriaLanguage';
//Component Imports
import RatingsGrid from './RatingsGrid';
import ArchivedStudentList from './ArchivedStudentList';
import ScoreEntryModal from '../ScoreEntryModal/ScoreEntryModal';
import Navigation from '../Navigation/Navigation';

import AddStudentModal from '../AddStudentModal/AddStudentModal';
import EditCriteriaModal from '../EditCriteriaModal/EditCriteriaModal';

//service imports
import supabase from '../../services/supabase';
//utils
import { getCriteriaLabel } from '../../utils/criteriaLabels';
import { sortOldestFirst } from '../../utils/chartCoordinates';
//types
import {
    type Rating,
    type Category,
    type Student,
    type Term,
    type Cls,
    type UserProfile,
} from '../../types';
import Terms from './Terms';
import useRatingLookup from '../../hooks/useRatingLookup';

type DashboardProps = {
    userId: string;
};

function Dashboard({ userId }: DashboardProps) {
    //State vars
    const [addStudentModal, setAddStudentModal] = useState(false);
    const [editCriteriaModal, setEditCriteriaModal] = useState(false);
    const [selectedTermId, setSelectedTermId] = useState<number | null>(null);
    // Selected class lives in the URL (?classId=) so the profile's "Back" link returns to it
    const [searchParams, setSearchParams] = useSearchParams();
    const selectedClassId = Number(searchParams.get('classId')) || 1;
    // The Archived tab is not a class, so it is tracked apart from selectedClassId
    const [isArchivedViewSelected, setIsArchivedViewSelected] = useState(false);
    const [activeCell, setActiveCell] = useState<{
        studentId: number;
        categoryId: number;
    } | null>(null);

    //Supabase Fetches
    const {
        data: categories,
        error: categoriesError,
        refetch: refetchCriteria,
    } = useFetch<Category>('categories', 'id, criteria, criteria_en, class_id, is_active');
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
    const { data: users } = useFetch<UserProfile>('users', 'id, role');

    const {
        data: ratings,
        error: ratingsError,
        refetch: refetchRatings,
    } = useFetch<Rating>(
        'ratings',
        'student_id, category_id, level, created_at, term_id, note',
    );

    //Helpers
    const onSelectClass = (id: number) => {
        setIsArchivedViewSelected(false);
        setSearchParams({ classId: String(id) });
    };
    const onAddStudentSucess = () => {
        setAddStudentModal(false);
    };

    //Custom Hook Uses
    const { criteriaLanguage, changeCriteriaLanguage } = useCriteriaLanguage();

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
    // The archived view is the one place that lists inactive students
    const archivedStudents = students.filter((student) => !student.is_active);
    // The fetch has no fixed order (an edited row comes back last), so keep criteria in the order they were created
    const visibleCategories = categories
        .filter((c) => c.class_id === selectedClassId && c.is_active)
        .sort(
            (earlierCategory, laterCategory) =>
                earlierCategory.id - laterCategory.id,
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
    const isAdmin = users.find((user) => user.id === userId)?.role === 'admin';
    const currentRating = activeCell
        ? ratingLookup[
              `${activeCell.studentId}-${activeCell.categoryId}-${effectiveTermId}`
          ]
        : undefined;

    // Chart data for the score entry modal: this child's ratings for the criterion,
    // and the same criterion's ratings across the active students in the class
    const visibleStudentIds = new Set(
        visibleStudents.map((visibleStudent) => visibleStudent.id),
    );
    const activeChildRatingsOldestFirst = sortOldestFirst(
        ratings.filter(
            (rating) =>
                rating.student_id === activeCell?.studentId &&
                rating.category_id === activeCell?.categoryId,
        ),
    );
    const activeClassRatingsForCriterion = ratings.filter(
        (rating) =>
            rating.category_id === activeCell?.categoryId &&
            visibleStudentIds.has(rating.student_id),
    );
    return (
        <>
            <Navigation
                handleSignOut={handleSignOut}
                criteriaLanguage={criteriaLanguage}
                onChangeCriteriaLanguage={changeCriteriaLanguage}
                selectedClassId={selectedClassId}
                classes={classes}
                onSelectClass={onSelectClass}
                isArchivedViewSelected={isArchivedViewSelected}
                onSelectArchivedView={() => setIsArchivedViewSelected(true)}
                setEditCriteriaModal={setEditCriteriaModal}
                setAddStudentModal={setAddStudentModal}
            ></Navigation>
            <div className="flex flex-col justify-center items-center">
                {!isArchivedViewSelected && (
                    <Terms
                        effectiveTermId={effectiveTermId}
                        selectedTermId={selectedTermId}
                        setSelectedTermId={setSelectedTermId}
                        terms={terms}
                    />
                )}
                {/* Dashboard */}
                {isArchivedViewSelected ? (
                    <ArchivedStudentList
                        archivedStudents={archivedStudents}
                        classes={classes}
                        isAdmin={isAdmin}
                        refetchStudents={refetchStudents}
                    />
                ) : visibleCategories.length === 0 &&
                visibleStudents.length === 0 ? (
                    <div className="justify-center items-center my-5 text-center">
                        <p className="font-bold text-xl">
                            Add Criteria or Add students to get started
                        </p>
                    </div>
                ) : (
                    <RatingsGrid
                        termId={effectiveTermId}
                        students={visibleStudents}
                        categories={visibleCategories}
                        criteriaLanguage={criteriaLanguage}
                        ratingsLookup={ratingLookup}
                        onActiveCell={(studentId, categoryId) =>
                            setActiveCell({ studentId, categoryId })
                        }
                    ></RatingsGrid>
                )}
                {activeCell && activeStudent && activeCategory && activeClass && (
                    <ScoreEntryModal
                        studentId={activeStudent.id}
                        studentName={activeStudent.name}
                        className={activeClass.name}
                        categoryId={activeCategory.id}
                        criteriaLabel={getCriteriaLabel(
                            activeCategory,
                            criteriaLanguage,
                        )}
                        termId={effectiveTermId ?? null}
                        userId={userId}
                        currentTermRating={currentRating}
                        childRatingsOldestFirst={activeChildRatingsOldestFirst}
                        classRatingsForCriterion={activeClassRatingsForCriterion}
                        showClassAverage={true}
                        refetchRatings={refetchRatings}
                        onClose={() => setActiveCell(null)}
                    />
                )}
                {addStudentModal && (
                    <AddStudentModal
                        refetchStudents={refetchStudents}
                        onAddStudentSuccess={onAddStudentSucess}
                        selectedClassId={selectedClassId}
                        onClose={() => setAddStudentModal(false)}
                    ></AddStudentModal>
                )}
                {editCriteriaModal && (
                    <EditCriteriaModal
                        activeCategories={visibleCategories}
                        className={activeClass?.name ?? ''}
                        selectedClassId={selectedClassId}
                        isAdmin={isAdmin}
                        refetchCriteria={refetchCriteria}
                        onClose={() => setEditCriteriaModal(false)}
                    ></EditCriteriaModal>
                )}
            </div>
        </>
    );
}

export default Dashboard;
