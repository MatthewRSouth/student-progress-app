import { useRef } from 'react';
import useEditStudent from '../../hooks/useEditStudent';
import ModalContainer from '../../ui/ModalContainer';
import Avatar from '../../ui/Avatar';
import { ACCEPTED_AVATAR_FILE_TYPES } from '../../constants/avatars';
import { type Student, type Cls } from '../../types';

type EditStudentModalProps = {
    student: Student;
    classes: Cls[];
    // Signed URL of the saved photo, if the student has one
    avatarUrl?: string;
    isAdmin: boolean;
    refetchStudents: () => void;
    onEditStudentSuccess: () => void;
    onClose: () => void;
};

const inputClasses =
    'w-full rounded-lg border border-[#E6DDCE] bg-white px-3 py-2 mt-1 mb-4 focus:outline-teal-700';
const labelClasses = 'text-[11px] font-semibold uppercase tracking-wide text-[#8C8377]';
const photoButtonClasses =
    'border border-[#E6DDCE] bg-[#FBF8F2] rounded-lg px-3 py-1.5 text-sm font-semibold cursor-pointer hover:bg-[#F4EEE3]';

function EditStudentModal({
    student,
    classes,
    avatarUrl,
    isAdmin,
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
        pendingAvatarPreviewUrl,
        isAvatarRemovalRequested,
        avatarError,
        handleSelectAvatarFile,
        handleRemoveAvatar,
    } = useEditStudent(student, refetchStudents, onEditStudentSuccess);
    const avatarFileInputRef = useRef<HTMLInputElement>(null);

    // What the avatar will be after Save: the newly chosen photo, the saved one, or initials
    const savedAvatarUrl = isAvatarRemovalRequested ? null : avatarUrl;
    const previewAvatarUrl = pendingAvatarPreviewUrl ?? savedAvatarUrl;
    const hasPhoto =
        pendingAvatarPreviewUrl !== null ||
        (student.avatar_path !== null && !isAvatarRemovalRequested);

    return (
        <ModalContainer onClose={onClose}>
            <h2 className="text-xl font-bold text-[#2E2A24]">Edit child</h2>
            <p className="text-sm text-[#5C5343] mb-4">
                Update this child's name, class or photo.
            </p>

            {isAdmin && (
                <>
                    <p className={labelClasses}>Photo</p>
                    <div className="flex items-center gap-3 mt-1 mb-4">
                        <Avatar
                            name={student.name}
                            studentId={student.id}
                            imageUrl={previewAvatarUrl}
                            size="large"
                        />
                        <input
                            ref={avatarFileInputRef}
                            type="file"
                            accept={ACCEPTED_AVATAR_FILE_TYPES.join(',')}
                            className="hidden"
                            onChange={(e) => {
                                const selectedFile = e.target.files?.[0];
                                if (selectedFile) handleSelectAvatarFile(selectedFile);
                                // Clear the input so choosing the same file again still fires onChange
                                e.target.value = '';
                            }}
                        />
                        <button
                            type="button"
                            onClick={() => avatarFileInputRef.current?.click()}
                            className={photoButtonClasses}
                        >
                            {hasPhoto ? 'Replace' : 'Upload'}
                        </button>
                        {hasPhoto && (
                            <button
                                type="button"
                                onClick={handleRemoveAvatar}
                                className={photoButtonClasses}
                            >
                                Remove
                            </button>
                        )}
                    </div>
                    {avatarError && (
                        <p className="text-red-600 text-sm -mt-2 mb-4">{avatarError}</p>
                    )}
                </>
            )}

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
