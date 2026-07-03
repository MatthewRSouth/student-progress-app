import ErrorMessage from '../../ui/ErrorMessage';
import SuccessMessage from '../../ui/SuccessMessage';

interface ModalProps {
    setRating: (rating: number) => void;
    onHandleRating: (e: React.MouseEvent<HTMLButtonElement>) => void;
    errorMessage: string;
    status: string;
}

function ScoreModal({
    setRating,
    onHandleRating,
    errorMessage,
    status,
}: ModalProps) {
    return (
        <div className="flex justify-center items-center w-auto mt-5">
            <form action="">
                <h2>submit a rating</h2>
                <label htmlFor="rating">choose your rating</label>
                <br></br>
                <button
                    type="button"
                    onClick={() => {
                        setRating(1);
                    }}
                    className="bg-red-500 rounded-md w-auto m-2 p-2 border-2 border-black"
                >
                    1
                </button>
                <button
                    type="button"
                    onClick={() => {
                        setRating(2);
                    }}
                    className="bg-yellow-500 rounded-md w-auto m-2 p-2 border-2 border-black"
                >
                    2
                </button>
                <button
                    type="button"
                    onClick={() => {
                        setRating(3);
                    }}
                    className="bg-green-500 rounded-md w-auto m-2 p-2 border-2 border-black"
                >
                    3
                </button>
                <button
                    type="button"
                    onClick={() => {
                        setRating(4);
                    }}
                    className="bg-blue-500 rounded-md w-auto m-2 p-2 border-2 border-black"
                >
                    4
                </button>
                <br></br>
                <button
                    type="submit"
                    onClick={onHandleRating}
                    className="bg-black text-white rounded-md w-auto m-2 p-2 border-2 border-black"
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
