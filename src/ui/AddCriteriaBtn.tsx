type AddCriteriaProps = {
    setAddCriteriaModal: (bool: boolean) => void;
};

function AddCriteriaBtn({ setAddCriteriaModal }: AddCriteriaProps) {
    return (
        <button
            onClick={() => setAddCriteriaModal(true)}
            className="bg-[#FBF8F2] text-[#06080F] border-2 p-3 rounded-lg text-center hover:cursor-pointer hover:bg-teal-800"
        >
            + Add Criteria
        </button>
    );
}

export default AddCriteriaBtn;
