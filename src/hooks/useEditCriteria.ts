import { useState } from 'react';
import supabase from '../services/supabase';

//Types
export type CriteriaNameChanges = {
    criteria?: string;
    criteria_en?: string | null;
};

// Renaming and archiving criteria are admin only, enforced by RLS.
// Criteria are never deleted: archiving sets is_active = false, so each child's ratings are kept.
function useEditCriteria(refetchCriteria: () => void) {
    const [editCriteriaError, setEditCriteriaError] = useState('');

    // Resolves to true when the row was changed, so the caller can revert its input when it wasn't
    async function updateCategory(
        categoryId: number,
        changedColumns: CriteriaNameChanges | { is_active: false },
        failureMessage: string,
    ) {
        try {
            setEditCriteriaError('');

            const { data, error } = await supabase
                .from('categories')
                .update(changedColumns)
                .eq('id', categoryId)
                .select();

            if (error) {
                console.error(error);
                setEditCriteriaError(failureMessage);
                return false;
            }
            // RLS blocks an UPDATE silently (0 rows, no error)
            if (!data || data.length === 0) {
                setEditCriteriaError('Only admins can edit criteria.');
                return false;
            }
            refetchCriteria();
            return true;
        } catch (err) {
            console.error(err);
            setEditCriteriaError(failureMessage);
            return false;
        }
    }

    async function handleUpdateCriteria(
        categoryId: number,
        nameChanges: CriteriaNameChanges,
    ) {
        if (nameChanges.criteria !== undefined && nameChanges.criteria === '') {
            setEditCriteriaError('A criteria name cannot be empty.');
            return false;
        }
        return updateCategory(
            categoryId,
            nameChanges,
            'Criteria could not be saved. please try again',
        );
    }

    async function handleArchiveCriteria(categoryId: number) {
        return updateCategory(
            categoryId,
            { is_active: false },
            'Criteria could not be removed. please try again',
        );
    }

    return { editCriteriaError, handleUpdateCriteria, handleArchiveCriteria };
}

export default useEditCriteria;
