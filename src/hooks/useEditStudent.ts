import { useState } from 'react';
import supabase from '../services/supabase';
import { joinName, splitName } from '../utils/studentNames';
import { type Student } from '../types';

//Types
type Payload = {
    name: string;
    class_id: number;
};

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

    async function handleEditStudent(e: React.MouseEvent<HTMLButtonElement>) {
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
            onSuccess();
            refetchStudents();
        } catch (err) {
            console.error(err);
        } finally {
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
    };
}

export default useEditStudent;
