//React Hooks
import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
//Custom Hooks
import useFetch from '../../hooks/useFetch';
import useRatingLookup from '../../hooks/useRatingLookup';
//Component Imports
import PageHeader from '../../ui/PageHeader';
import ProfileHeader from './ProfileHeader';
import CriterionCard from './CriterionCard';
import InteractionsSection from './InteractionsSection';
import EditStudentModal from '../EditStudentModal/EditStudentModal';
import RemoveStudentModal from '../RemoveStudentModal/RemoveStudentModal';
//service imports
import supabase from '../../services/supabase';
//utils & constants
import { LEVELS } from '../../constants/levels';
import { sortOldestFirst } from '../../utils/chartCoordinates';
import { splitName } from '../../utils/studentNames';
//types
import {
    type Rating,
    type Category,
    type Student,
    type Term,
    type Cls,
    type Observation,
    type StudentSummary,
    type UserProfile,
} from '../../types';

type StudentProfileProps = {
    userId: string;
};

function StudentProfile({ userId }: StudentProfileProps) {
    const { studentId: studentIdParam } = useParams();
    const studentId = Number(studentIdParam);
    const navigate = useNavigate();

    //State vars
    const [editStudentModal, setEditStudentModal] = useState(false);
    const [removeStudentModal, setRemoveStudentModal] = useState(false);

    //Supabase Fetches
    const {
        data: students,
        loading: studentsLoading,
        error: studentsError,
        refetch: refetchStudents,
    } = useFetch<Student>('students', 'id, name, class_id, is_active');
    const {
        data: categories,
        loading: categoriesLoading,
        error: categoriesError,
    } = useFetch<Category>('categories', 'id, criteria, class_id, is_active');
    const {
        data: ratings,
        loading: ratingsLoading,
        error: ratingsError,
    } = useFetch<Rating>(
        'ratings',
        'student_id, category_id, level, created_at, term_id',
    );
    const {
        data: terms,
        loading: termsLoading,
        error: termsError,
    } = useFetch<Term>('terms', 'id, term, created_at');
    const {
        data: classes,
        loading: classesLoading,
        error: classesError,
    } = useFetch<Cls>('classes', 'id,name');
    const {
        data: observations,
        error: observationsError,
        refetch: refetchObservations,
    } = useFetch<Observation>(
        'observations',
        'id, student_id, note, user_id, is_active, created_at',
    );
    const {
        data: summaries,
        loading: summariesLoading,
        error: summariesError,
    } = useFetch<StudentSummary>(
        'student_summaries',
        'student_id, summary, updated_at',
    );
    const { data: users, loading: usersLoading } = useFetch<UserProfile>(
        'users',
        'id, role',
    );

    //Memo to rate look up
    const ratingLookup = useRatingLookup(ratings);

    // The page title appears in the browser's print header (if left on) and names saved PDFs
    const profileStudentName = students.find(
        (candidate) => candidate.id === studentId && candidate.is_active,
    )?.name;
    useEffect(() => {
        if (!profileStudentName) return;
        const previousTitle = document.title;
        document.title = `${profileStudentName} · Progress report`;
        return () => {
            document.title = previousTitle;
        };
    }, [profileStudentName]);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
    };

    const pageHeader = (
        <div className="print:hidden">
            <PageHeader handleSignOut={handleSignOut} />
        </div>
    );

    if (
        studentsError ||
        categoriesError ||
        ratingsError ||
        termsError ||
        classesError ||
        observationsError ||
        summariesError
    ) {
        return (
            <>
                {pageHeader}
                <p className="text-center my-10">
                    There was an error loading this student.
                </p>
            </>
        );
    }

    // Only students and observations are refetched on this page; the rest load once.
    // Gating on students' first load only keeps the summary field mounted during refetches.
    const isFirstLoad =
        (studentsLoading && students.length === 0) ||
        categoriesLoading ||
        ratingsLoading ||
        termsLoading ||
        classesLoading ||
        summariesLoading ||
        usersLoading;
    if (isFirstLoad) {
        return (
            <>
                {pageHeader}
                <p className="text-center my-10">loading...</p>
            </>
        );
    }

    const student = students.find(
        (candidate) => candidate.id === studentId && candidate.is_active,
    );
    if (!student) {
        return (
            <>
                {pageHeader}
                <div className="text-center my-10">
                    <p className="font-bold text-xl mb-2">
                        This student isn't available.
                    </p>
                    <Link to="/" className="text-teal-700 hover:underline">
                        ← Back to dashboard
                    </Link>
                </div>
            </>
        );
    }

    //Current and Active Variables
    const studentClass = classes.find((cls) => cls.id === student.class_id);
    const className = studentClass?.name ?? '';
    const backToClassPath = `/?classId=${student.class_id}`;
    const isAdmin =
        users.find((user) => user.id === userId)?.role === 'admin';

    const mostRecentTerms = [...terms].sort((a: Term, b: Term) =>
        b.created_at.localeCompare(a.created_at),
    );
    const currentTermId = mostRecentTerms[0]?.id;

    // Students and Categories Filter
    const activeCategories = categories.filter(
        (category) => category.class_id === student.class_id && category.is_active,
    );
    const activeClassmateIds = new Set(
        students
            .filter(
                (classmate) =>
                    classmate.class_id === student.class_id && classmate.is_active,
            )
            .map((classmate) => classmate.id),
    );

    const currentTermRatings = activeCategories
        .map(
            (category) =>
                ratingLookup[`${student.id}-${category.id}-${currentTermId}`],
        )
        .filter((rating) => rating !== undefined);
    const currentTermAverage =
        currentTermRatings.length === 0
            ? null
            : currentTermRatings.reduce(
                  (levelTotal, rating) => levelTotal + rating.level,
                  0,
              ) / currentTermRatings.length;

    const studentRatingCount = ratings.filter(
        (rating) => rating.student_id === student.id,
    ).length;
    // Archived notes still count as history: they block a hard delete
    const studentObservations = observations.filter(
        (observation) => observation.student_id === student.id,
    );
    const activeObservationsNewestFirst = studentObservations
        .filter((observation) => observation.is_active)
        .sort((newer, older) => older.created_at.localeCompare(newer.created_at));
    const initialSummary =
        summaries.find((summary) => summary.student_id === student.id)?.summary ??
        '';

    return (
        <>
            {pageHeader}
            <div className="max-w-[830px] mx-auto px-4 pb-10 print:px-0 print:max-w-none">
                <Link
                    to={backToClassPath}
                    className="print:hidden inline-block text-sm text-[#5C5343] hover:underline my-4"
                >
                    ← Back to {className}
                </Link>

                {/* Browser print headers (date, URL) can't be removed from CSS; the teacher turns them off once */}
                <p className="print:hidden text-xs text-[#8C8377] bg-[#FBF8F2] border border-[#EFEAE1] rounded-lg px-3 py-2 mb-4">
                    Printing for a parent? In the print dialog, open{' '}
                    <span className="font-semibold">More settings</span> and untick{' '}
                    <span className="font-semibold">Headers and footers</span>.
                </p>

                <ProfileHeader
                    student={student}
                    className={className}
                    currentTermAverage={currentTermAverage}
                    isAdmin={isAdmin}
                    onEdit={() => setEditStudentModal(true)}
                    onRemove={() => setRemoveStudentModal(true)}
                />

                {/* Legend */}
                <div className="flex justify-end items-center gap-4 text-[11px] text-[#5C5343] my-3">
                    <span className="hidden print:flex items-center gap-3">
                        {Object.entries(LEVELS).map(([level, { color, label }]) => (
                            <span key={level} className="flex items-center gap-1">
                                <span className={`${color} h-2.5 w-2.5 rounded-full`} />
                                {label}
                            </span>
                        ))}
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="inline-block w-4 border-t-2 border-[#2E2A24]" />
                        This child
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="inline-block w-4 border-t-2 border-dashed border-[#18605C]/60" />
                        Class average
                    </span>
                </div>

                {activeCategories.length === 0 ? (
                    <p className="text-center text-[#5C5343] my-6">
                        No criteria have been added for {className} yet.
                    </p>
                ) : (
                    <div className="grid grid-cols-2 gap-4">
                        {activeCategories.map((category) => (
                            <CriterionCard
                                key={category.id}
                                category={category}
                                childRatingsOldestFirst={sortOldestFirst(
                                    ratings.filter(
                                        (rating) =>
                                            rating.student_id === student.id &&
                                            rating.category_id === category.id,
                                    ),
                                )}
                                classRatingsForCriterion={ratings.filter(
                                    (rating) =>
                                        rating.category_id === category.id &&
                                        activeClassmateIds.has(rating.student_id),
                                )}
                                currentTermRating={
                                    ratingLookup[
                                        `${student.id}-${category.id}-${currentTermId}`
                                    ]
                                }
                            />
                        ))}
                    </div>
                )}

                <div className="mt-4">
                    <InteractionsSection
                        key={student.id}
                        studentId={student.id}
                        firstName={splitName(student.name).firstName}
                        userId={userId}
                        isAdmin={isAdmin}
                        initialSummary={initialSummary}
                        activeObservationsNewestFirst={activeObservationsNewestFirst}
                        refetchObservations={refetchObservations}
                    />
                </div>
            </div>

            {editStudentModal && (
                <EditStudentModal
                    student={student}
                    classes={classes}
                    refetchStudents={refetchStudents}
                    onEditStudentSuccess={() => setEditStudentModal(false)}
                    onClose={() => setEditStudentModal(false)}
                />
            )}
            {removeStudentModal && (
                <RemoveStudentModal
                    student={student}
                    ratingCount={studentRatingCount}
                    observationCount={studentObservations.length}
                    className={className}
                    onBackToClass={() => navigate(backToClassPath)}
                    onClose={() => setRemoveStudentModal(false)}
                />
            )}
        </>
    );
}

export default StudentProfile;
