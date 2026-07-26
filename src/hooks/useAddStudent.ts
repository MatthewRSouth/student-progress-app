import { useState } from 'react';
import supabase from '../services/supabase';

//Types
type Payload = {
    name: string;
    class_id: number;
};

function useAddStudent(refetchStudents: () => void, onSuccess: () => void) {
    const [name, setName] = useState('');
    const [addStudentError, setAddStudentError] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleAddStudent(
        e: React.MouseEvent<HTMLButtonElement>,
        class_id: number,
    ) {
        try {
            e.preventDefault();
            setLoading(true);
            setAddStudentError('');

            //No name prevention
            if (name === '') {
                setAddStudentError('Please insert their name');
                return;
            }

            //set payload
            const payload: Payload = {
                name: name,
                class_id: class_id,
            };

            const { error } = await supabase
                .from('students')
                .insert(payload)
                .select();

            if (error) {
                console.error(error);
                setAddStudentError(
                    'Student could not be saved. please try again',
                );
                return;
            }
            onSuccess();
            refetchStudents();
            setName('');
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }
    return { name, setName, addStudentError, handleAddStudent, loading };
}

export default useAddStudent;
