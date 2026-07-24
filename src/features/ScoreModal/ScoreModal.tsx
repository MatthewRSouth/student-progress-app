import ErrorMessage from '../../ui/ErrorMessage';
import SuccessMessage from '../../ui/SuccessMessage';
import { MODALLEVELS } from '../../constants/levels';
import { type Student, type Category, type Cls } from '../../types';

interface ModalProps {
    onClose: () => void;
    onSetRating: (rating: number) => void;
    onHandleRating: (e: React.MouseEvent<HTMLButtonElement>) => void;
    errorMessage: string;
    status: string;
    student: Student;
    category: Category;
    studentClass: Cls;
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
}: ModalProps) {
    return (
        <div
            onClick={onClose}
            className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 h-screen"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="bg-white justify-start h-[40%] w-[20%] items-center  rounded-xl"
            >
                <div>
                    <div className="flex text-start justify-between m-4">
                        <div>
                            <p>
                                {studentClass.name}・{student.name}
                            </p>
                            <h1 className="font-bold">{category.criteria} </h1>
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
                            className={`${color} rounded-sm cursor-pointer w-18 h-15 m-2 border-2 border-black`}
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

                        <br></br>
                        {status === 'success' ? (
                            <SuccessMessage message={'Saved rating'} />
                        ) : (
                            <ErrorMessage message={errorMessage} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ScoreModal;
