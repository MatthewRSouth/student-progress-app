import { useState } from 'react';
import supabase from '../services/supabase';

//Types
type Payload = {
    criteria: string;
    class_id: number;
};

function useAddCriteria(refetchCriteria: () => void, onSuccess: () => void) {
    const [criteria, setCriteria] = useState('');
    const [addCriteriaError, setAddCriteriaError] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleAddCriteria(
        e: React.MouseEvent<HTMLButtonElement>,
        class_id: number,
    ) {
        try {
            e.preventDefault();
            setLoading(true);
            setAddCriteriaError('');

            //No name prevention
            if (criteria === '') {
                setAddCriteriaError('Please insert the criteria');
                return;
            }

            //set payload
            const payload: Payload = {
                criteria: criteria,
                class_id: class_id,
            };

            const { error } = await supabase
                .from('categories')
                .insert(payload)
                .select();

            if (error) {
                console.error(error);
                setAddCriteriaError(
                    'Criteria could not be saved. please try again',
                );
                return;
            }
            onSuccess();
            refetchCriteria();
            setCriteria('');
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }
    return {
        criteria,
        setCriteria,
        addCriteriaError,
        handleAddCriteria,
        loading,
    };
}

export default useAddCriteria;
