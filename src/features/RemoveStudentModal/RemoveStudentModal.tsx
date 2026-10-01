import useRemoveStudent from '../../hooks/useRemoveStudent';
import ModalContainer from '../../ui/ModalContainer';
import { type Student } from '../../types';

type RemoveStudentModalProps = {
    student: Student;
    className: string;
    onBackToClass: () => void;
    onClose: () => void;
};

function RemoveStudentModal({
    student,
    className,
    onBackToClass,
    onClose,
}: RemoveStudentModalProps) {
    const { studentArchived, removeStudentError, handleRemoveStudent, loading } =
        useRemoveStudent();

    if (studentArchived) {
        return (
            <ModalContainer onClose={onBackToClass}>
                <h2 className="text-xl font-bold text-[#2E2A24] mb-2">Student archived</h2>
                <p className="text-sm text-[#5C5343] mb-6">
                    {student.name} has been archived. They no longer appear on the
                    dashboard, and their ratings and notes are kept. You can restore
                    them from the Archived tab.
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

    return (
        <ModalContainer onClose={onClose}>
            <h2 className="text-xl font-bold text-[#2E2A24] mb-2">Remove {student.name}?</h2>
            <p className="text-sm text-[#5C5343] mb-6">
                {student.name} will be archived: hidden from the dashboard, with their
                ratings and notes kept. An admin can restore them from the Archived tab.
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
                    onClick={() => handleRemoveStudent(student.id)}
                    className="flex-1 bg-[#B5402F] hover:opacity-90 text-white rounded-lg px-4 py-2 font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Archive student
                </button>
            </div>
            {removeStudentError && (
                <p className="text-red-600 text-sm text-center mt-2">{removeStudentError}</p>
            )}
        </ModalContainer>
    );
}

export default RemoveStudentModal;
