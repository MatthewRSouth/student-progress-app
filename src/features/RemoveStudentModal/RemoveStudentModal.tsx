import useRemoveStudent from '../../hooks/useRemoveStudent';
import ModalContainer from '../../ui/ModalContainer';
import { type Student } from '../../types';

type RemoveStudentModalProps = {
    student: Student;
    ratingCount: number;
    observationCount: number;
    className: string;
    onBackToClass: () => void;
    onClose: () => void;
};

function RemoveStudentModal({
    student,
    ratingCount,
    observationCount,
    className,
    onBackToClass,
    onClose,
}: RemoveStudentModalProps) {
    const { removalOutcome, removeStudentError, handleRemoveStudent, loading } =
        useRemoveStudent();
    const studentHasHistory = ratingCount > 0 || observationCount > 0;

    if (removalOutcome) {
        return (
            <ModalContainer onClose={onBackToClass}>
                <h2 className="text-xl font-bold text-[#2E2A24] mb-2">
                    {removalOutcome === 'deleted' ? 'Student deleted' : 'Student archived'}
                </h2>
                <p className="text-sm text-[#5C5343] mb-6">
                    {removalOutcome === 'deleted'
                        ? `${student.name} has been permanently deleted.`
                        : `${student.name} has been archived. They no longer appear on the dashboard, and their ratings and notes are kept.`}
                </p>
                <button
                    onClick={onBackToClass}
                    className="w-full bg-teal-700 hover:bg-teal-800 text-white rounded-lg px-4 py-2 font-semibold cursor-pointer"
                >
                    Back to {className}
                </button>
            </ModalContainer>
        );
    }

    const historyParts = [
        ratingCount > 0 ? `${ratingCount} rating${ratingCount === 1 ? '' : 's'}` : '',
        observationCount > 0
            ? `${observationCount} note${observationCount === 1 ? '' : 's'}`
            : '',
    ].filter(Boolean);

    return (
        <ModalContainer onClose={onClose}>
            <h2 className="text-xl font-bold text-[#2E2A24] mb-2">Remove {student.name}?</h2>
            <p className="text-sm text-[#5C5343] mb-6">
                {studentHasHistory
                    ? `${student.name} has ${historyParts.join(' and ')}, so they will be archived: hidden from the dashboard, with their history kept.`
                    : `${student.name} has no ratings or notes, so they will be permanently deleted. This cannot be undone.`}
            </p>
            <div className="flex gap-2">
                <button
                    onClick={onClose}
                    type="button"
                    className="bg-[#F4EFE6] rounded-lg px-4 py-2 font-semibold cursor-pointer hover:bg-[#EFE7D8]"
                >
                    Cancel
                </button>
                <button
                    type="button"
                    disabled={loading}
                    onClick={() => handleRemoveStudent(student.id, studentHasHistory)}
                    className="flex-1 bg-[#B5402F] hover:opacity-90 text-white rounded-lg px-4 py-2 font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {studentHasHistory ? 'Archive student' : 'Delete student'}
                </button>
            </div>
            {removeStudentError && (
                <p className="text-red-600 text-sm text-center mt-2">{removeStudentError}</p>
            )}
        </ModalContainer>
    );
}

export default RemoveStudentModal;
