//Component Imports
import ErrorMessage from '../../ui/ErrorMessage';
import SuccessMessage from '../../ui/SuccessMessage';
import ModalContainer from '../../ui/ModalContainer';

//Type and Other imports
import { MODALLEVELS } from '../../constants/levels';
import { type Student, type Category, type Cls } from '../../types';

interface ModalPropTypes {
    onClose: () => void;
    onSetRating: (rating: number) => void;
    onHandleRating: (e: React.MouseEvent<HTMLButtonElement>) => void;
    errorMessage: string;
    status: string;
    student: Student;
    category: Category;
    studentClass: Cls;
    currentRating?: 1 | 2 | 3 | 4;
    rating?: number;
}

function ScoreModal({
    onSetRating,
    onHandleRating,
    errorMessage,
    status,
    onClose,
    student,
    category,
    studentClass,
    rating,
    currentRating,
}: ModalPropTypes) {
    return (
        <ModalContainer onClose={onClose}>
            <div className="flex text-start justify-between">
                <div>
                    <p>
                        {studentClass.name}・{student.name}
                    </p>
                    <h1 className="font-bold">{category.criteria} </h1>
                    <p className="text-xs text-gray-600">
                        {currentRating
                            ? `Currently: ${MODALLEVELS[currentRating].label}`
                            : 'Not yet rated'}
                    </p>
                </div>
                <button
                    onClick={onClose}
                    className="flex items-center justify-center rounded-full h-7 w-7 bg-[#F8ECD4] hover:bg-[#E3A93E] text-black p-1 text-center  cursor-pointer"
                >
                    x
                </button>
            </div>

            {Object.entries(MODALLEVELS).map(([level, { color }]) => (
                <button
                    key={level}
                    type="button"
                    onClick={() => {
                        onSetRating(Number(level));
                    }}
                    className={`${color}  rounded-sm cursor-pointer w-18 h-15 m-2 border-2 border-black ${Number(level) === rating ? 'ring-4 ring-teal-700' : ''}`}
                >
                    {level}
                </button>
            ))}

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
                    onClick={onHandleRating}
                    className="bg-teal-700 hover:bg-teal-800 text-white rounded-md text-sm cursor-pointer w-[60%] m-2 p-2 border-2 border-black "
                >
                    Save Score
                </button>
            </div>
            {status === 'success' ? (
                <SuccessMessage message={'Saved rating'} />
            ) : (
                <ErrorMessage message={errorMessage} />
            )}
        </ModalContainer>
    );
}

export default ScoreModal;
