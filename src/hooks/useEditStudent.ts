import { useState, useEffect } from 'react';
import supabase from '../services/supabase';
import { joinName, splitName } from '../utils/studentNames';
import { resizeAvatarImage } from '../utils/resizeAvatarImage';
import { AVATAR_BUCKET } from '../constants/avatars';
import { type Student } from '../types';

//Types
type Payload = {
    name: string;
    class_id: number;
    // Only sent when the photo was changed or removed
    avatar_path?: string | null;
};

// Deleting a photo file is admin only, enforced by the storage policies.
// A failure is logged, never shown: the student row is already correct either way.
async function deleteAvatarFile(avatarPath: string) {
    const { error } = await supabase.storage
        .from(AVATAR_BUCKET)
        .remove([avatarPath]);
    if (error) console.error(error);
}

function useEditStudent(
    student: Student,
    refetchStudents: () => void,
    onSuccess: () => void,
) {
    const initialName = splitName(student.name);
    const [firstName, setFirstName] = useState(initialName.firstName);
    const [lastName, setLastName] = useState(initialName.lastName);
    const [classId, setClassId] = useState(student.class_id);
    const [editStudentError, setEditStudentError] = useState('');
    const [loading, setLoading] = useState(false);
    // The photo chosen in the modal. Nothing is uploaded until Save.
    const [pendingAvatarImage, setPendingAvatarImage] = useState<Blob | null>(
        null,
    );
    const [pendingAvatarPreviewUrl, setPendingAvatarPreviewUrl] = useState<
        string | null
    >(null);
    const [isAvatarRemovalRequested, setIsAvatarRemovalRequested] =
        useState(false);
    const [avatarError, setAvatarError] = useState('');

    // Revoke the preview's object URL when it is replaced and when the modal closes
    useEffect(() => {
        if (!pendingAvatarPreviewUrl) return;
        return () => URL.revokeObjectURL(pendingAvatarPreviewUrl);
    }, [pendingAvatarPreviewUrl]);

    async function handleSelectAvatarFile(file: File) {
        setAvatarError('');
        const { resizedImage, errorMessage } = await resizeAvatarImage(file);
        if (errorMessage !== null) {
            setAvatarError(errorMessage);
            return;
        }
        setPendingAvatarImage(resizedImage);
        setPendingAvatarPreviewUrl(URL.createObjectURL(resizedImage));
        setIsAvatarRemovalRequested(false);
    }

    function handleRemoveAvatar() {
        setAvatarError('');
        setPendingAvatarImage(null);
        setPendingAvatarPreviewUrl(null);
        setIsAvatarRemovalRequested(student.avatar_path !== null);
    }

    async function handleEditStudent(e: React.MouseEvent<HTMLButtonElement>) {
        // Set once the new photo is in the bucket, cleared once the row points at it
        let unsavedUploadedAvatarPath: string | null = null;
        try {
            e.preventDefault();
            setLoading(true);
            setEditStudentError('');

            //No name prevention
            if (firstName.trim() === '') {
                setEditStudentError('Please insert their first name');
                return;
            }

            //set payload
            const payload: Payload = {
                name: joinName(firstName, lastName),
                class_id: classId,
            };

            // Photo save order: upload the new file, update the row, then delete the old file
            if (pendingAvatarImage) {
                // A new filename every time, so an upload never overwrites an existing file
                const newAvatarPath = `${student.id}/${Date.now()}.jpg`;
                const { error: uploadError } = await supabase.storage
                    .from(AVATAR_BUCKET)
                    .upload(newAvatarPath, pendingAvatarImage, {
                        contentType: 'image/jpeg',
                    });
                if (uploadError) {
                    console.error(uploadError);
                    setEditStudentError(
                        'Photo could not be uploaded. please try again',
                    );
                    return;
                }
                unsavedUploadedAvatarPath = newAvatarPath;
                payload.avatar_path = newAvatarPath;
            } else if (isAvatarRemovalRequested) {
                payload.avatar_path = null;
            }

            const { data, error } = await supabase
                .from('students')
                .update(payload)
                .eq('id', student.id)
                .select();

            if (error) {
                console.error(error);
                setEditStudentError(
                    'Student could not be saved. please try again',
                );
                return;
            }
            // RLS blocks an UPDATE silently (0 rows, no error)
            if (!data || data.length === 0) {
                setEditStudentError('Only admins can edit students.');
                return;
            }
            unsavedUploadedAvatarPath = null;

            const isAvatarChanged = payload.avatar_path !== undefined;
            if (isAvatarChanged && student.avatar_path) {
                await deleteAvatarFile(student.avatar_path);
            }
            onSuccess();
            refetchStudents();
        } catch (err) {
            console.error(err);
            setEditStudentError('Student could not be saved. please try again');
        } finally {
            // The row was not updated, so nothing points at the new file: remove it
            if (unsavedUploadedAvatarPath) {
                await deleteAvatarFile(unsavedUploadedAvatarPath);
            }
            setLoading(false);
        }
    }
    return {
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
    };
}

export default useEditStudent;
