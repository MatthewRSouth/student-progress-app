type EditCriteriaBtnProps = {
    setEditCriteriaModal: (bool: boolean) => void;
};

function EditCriteriaBtn({ setEditCriteriaModal }: EditCriteriaBtnProps) {
    return (
        <button
            onClick={() => setEditCriteriaModal(true)}
            className="bg-[#FBF8F2] text-[#06080F] border-2 p-3 rounded-lg text-center hover:cursor-pointer hover:bg-[#F4EEE3]"
        >
            Edit Criteria
        </button>
    );
}

export default EditCriteriaBtn;
