import useAddCriteria from '../../hooks/useAddCriteria';
import ModalContainer from '../../ui/ModalContainer';

type addCriteriaModalProps = {
    refetchCriteria: () => void;
    onAddCriteriaSuccess: () => void;
    selectedClassId: number;
    onClose: () => void;
};

function AddCriteriaModal({
    refetchCriteria,
    onAddCriteriaSuccess,
    selectedClassId,
    onClose,
}: addCriteriaModalProps) {
    const {
        criteria,
        setCriteria,
        addCriteriaError,
        handleAddCriteria,
        loading,
    } = useAddCriteria(refetchCriteria, onAddCriteriaSuccess);
    return (
        <ModalContainer onClose={onClose}>
            <div className="flex justify-end mx-3">
                <button
                    onClick={onClose}
                    className="flex items-center justify-center rounded-full h-7 w-7 bg-[#F8ECD4] hover:bg-[#E3A93E] text-black p-1 text-center  cursor-pointer"
                >
                    x
                </button>
            </div>
            <div className="flex justify-center">
                <input
                    onChange={(e) => setCriteria(e.target.value)}
                    value={criteria}
                    className="text-center p-5 m-4 rounded-lg border-4 border-teal-700 w-full"
                    placeholder="Criteria"
                    type="text"
                />
            </div>
            <div className="flex justify-center">
                <button
                    onClick={onClose}
                    type="button"
                    className="bg-transparent text-black rounded-md cursor-pointer w-auto m-2 p-2 border-2 border-black hover:bg-black hover:text-white"
                >
                    cancel
                </button>
                <button
                    type="button"
                    onClick={(e) => handleAddCriteria(e, selectedClassId)}
                    className="bg-teal-700 hover:bg-teal-800 text-white rounded-md text-sm cursor-pointer w-[60%] m-2 p-2 border-2 border-black disabled:opacity-50 disabled:cursor-not-allowed "
                    disabled={loading}
                >
                    Add Criteria
                </button>
            </div>
            {addCriteriaError && (
                <p className="text-red-600 text-sm text-center">
                    {addCriteriaError}
                </p>
            )}
        </ModalContainer>
    );
}

export default AddCriteriaModal;
