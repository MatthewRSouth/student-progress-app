type AddStudentProps = {
    setAddStudentModal: (bool: boolean) => void;
};

function AddStudent({ setAddStudentModal }: AddStudentProps) {
    return (
        <button
            onClick={() => setAddStudentModal(true)}
            className="bg-teal-700 text-white p-3 rounded-lg text-center hover:cursor-pointer hover:bg-teal-800 ml-4"
        >
            + Add Student
        </button>
    );
}

export default AddStudent;
