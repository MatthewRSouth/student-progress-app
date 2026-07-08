import ErrorMessage from '../../ui/ErrorMessage';
import SuccessMessage from '../../ui/SuccessMessage';
import { MODALLEVELS } from '../../constants/levels';

interface ModalProps {
    onSetRating: (rating: number) => void;
    onHandleRating: (e: React.MouseEvent<HTMLButtonElement>) => void;
    errorMessage: string;
    status: string;
}

function ScoreModal({
    onSetRating,
    onHandleRating,
    errorMessage,
    status,
}: ModalProps) {
    return (
        <div className="flex justify-center items-center w-auto mt-5">
            <form action="">
                <h2>submit a rating</h2>
                <br></br>
                {Object.entries(MODALLEVELS).map(([level, { color }]) => (
                    <button
                        key={level}
                        type="button"
                        onClick={() => {
                            onSetRating(Number(level));
                        }}
                        className={`${color} rounded-sm cursor-pointer w-auto m-2 p-2 border-2 border-black`}
                    >
                        {level}
                    </button>
                ))}

                <br></br>
                <button
                    type="submit"
                    onClick={onHandleRating}
                    className="bg-black text-white rounded-md cursor-pointer w-auto m-2 p-2 border-2 border-black"
                >
                    Save Score
                </button>

                {status === 'success' ? (
                    <SuccessMessage message={'Saved rating'} />
                ) : (
                    <ErrorMessage message={errorMessage} />
                )}
            </form>
        </div>
    );
}

export default ScoreModal;
