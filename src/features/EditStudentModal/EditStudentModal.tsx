import useEditStudent from '../../hooks/useEditStudent';
import ModalContainer from '../../ui/ModalContainer';
import { type Student, type Cls } from '../../types';

type EditStudentModalProps = {
    student: Student;
    classes: Cls[];
    refetchStudents: () => void;
    onEditStudentSuccess: () => void;
    onClose: () => void;
};

const inputClasses =
    'w-full rounded-lg border border-[#E6DDCE] bg-white px-3 py-2 mt-1 mb-4 focus:outline-teal-700';
const labelClasses = 'text-[11px] font-semibold uppercase tracking-wide text-[#8C8377]';

function EditStudentModal({
    student,
    classes,
    refetchStudents,
    onEditStudentSuccess,
    onClose,
}: EditStudentModalProps) {
    const {
        firstName,
        setFirstName,
        lastName,
        setLastName,
        classId,
        setClassId,
        editStudentError,
        handleEditStudent,
        loading,
    } = useEditStudent(student, refetchStudents, onEditStudentSuccess);

    return (
        <ModalContainer onClose={onClose}>
            <h2 className="text-xl font-bold text-[#2E2A24]">Edit child</h2>
            <p className="text-sm text-[#5C5343] mb-4">Update this child's name or class.</p>

            <label className={labelClasses}>
                First name
                <input
                    className={inputClasses}
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    type="text"
                />
            </label>
            <label className={labelClasses}>
                Last name
                <input
                    className={inputClasses}
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    type="text"
                />
            </label>

            <p className={labelClasses}>Class</p>
            <div className="flex flex-wrap gap-2 mt-1 mb-6">
                {classes.map((cls) => (
                    <button
                        key={cls.id}
                        type="button"
                        onClick={() => setClassId(cls.id)}
                        className={`rounded-full px-3 py-1.5 text-sm font-semibold border cursor-pointer ${
                            classId === cls.id
                                ? 'border-teal-700 bg-teal-50 text-teal-800'
                                : 'border-[#E6DDCE] bg-[#FBF8F2] hover:bg-[#F4EEE3]'
                        }`}
                    >
                        {cls.name}
                    </button>
                ))}
            </div>

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
                    onClick={handleEditStudent}
                    disabled={loading}
                    className="flex-1 bg-teal-700 hover:bg-teal-800 text-white rounded-lg px-4 py-2 font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Save
                </button>
            </div>
            {editStudentError && (
                <p className="text-red-600 text-sm text-center mt-2">{editStudentError}</p>
            )}
        </ModalContainer>
    );
}

export default EditStudentModal;
