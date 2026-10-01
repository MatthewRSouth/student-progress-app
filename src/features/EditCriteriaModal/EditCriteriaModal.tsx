import useAddCriteria from '../../hooks/useAddCriteria';
import useEditCriteria from '../../hooks/useEditCriteria';
import ModalContainer from '../../ui/ModalContainer';
import CriteriaRow from './CriteriaRow';
import { CRITERIA_MAX_LENGTH } from '../../constants/criteria';
import { type Category } from '../../types';

type EditCriteriaModalProps = {
    activeCategories: Category[];
    className: string;
    selectedClassId: number;
    isAdmin: boolean;
    refetchCriteria: () => void;
    onClose: () => void;
};

function EditCriteriaModal({
    activeCategories,
    className,
    selectedClassId,
    isAdmin,
    refetchCriteria,
    onClose,
}: EditCriteriaModalProps) {
    const {
        criteria,
        setCriteria,
        addCriteriaError,
        handleAddCriteria,
        loading,
    } = useAddCriteria(refetchCriteria);
    const { editCriteriaError, handleUpdateCriteria, handleArchiveCriteria } =
        useEditCriteria(refetchCriteria);

    return (
        <ModalContainer onClose={onClose}>
            <h2 className="text-xl font-bold text-[#2E2A24]">Criteria · {className}</h2>
            <p className="text-sm text-[#5C5343] mb-4">
                {isAdmin
                    ? "Rename, remove, or add what this class is assessed on. Renaming keeps each child's history."
                    : 'Add what this class is assessed on. Only admins can rename or remove criteria.'}
            </p>

            {activeCategories.length === 0 ? (
                <p className="text-sm text-[#A39A8C] py-2">No criteria yet.</p>
            ) : (
                <ul className="max-h-[50vh] overflow-y-auto pr-1">
                    {activeCategories.map((category) => (
                        <CriteriaRow
                            key={category.id}
                            category={category}
                            isAdmin={isAdmin}
                            onUpdateCriteria={handleUpdateCriteria}
                            onArchiveCriteria={handleArchiveCriteria}
                        />
                    ))}
                </ul>
            )}

            {/* A form so that Enter in the input adds, the same as the Add button */}
            <form
                className="flex gap-2 border-t border-[#F2EDE4] pt-3"
                onSubmit={(e) => handleAddCriteria(e, selectedClassId)}
            >
                <input
                    value={criteria}
                    onChange={(e) => setCriteria(e.target.value)}
                    maxLength={CRITERIA_MAX_LENGTH}
                    placeholder="Add a new criterion…"
                    aria-label="New criteria name"
                    className="flex-1 rounded-lg border border-dashed border-[#E6DDCE] px-3 py-2 text-sm focus:outline-teal-700"
                    type="text"
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-[#F4EFE6] rounded-lg px-4 py-2 text-sm font-semibold cursor-pointer hover:bg-[#EFE7D8] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Add
                </button>
            </form>

            {(editCriteriaError || addCriteriaError) && (
                <p className="text-red-600 text-sm text-center mt-2">
                    {editCriteriaError || addCriteriaError}
                </p>
            )}

            <button
                onClick={onClose}
                type="button"
                className="w-full mt-4 bg-teal-700 hover:bg-teal-800 text-white rounded-lg px-4 py-2 font-semibold cursor-pointer"
            >
                Done
            </button>
        </ModalContainer>
    );
}

export default EditCriteriaModal;
