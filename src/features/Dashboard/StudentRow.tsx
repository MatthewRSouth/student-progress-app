import { LEVELS } from '../../constants/levels';

//types
import { type Rating, type Category, type Student } from '../../types';

type StudentRowProps = {
    student: Student;
    categories: Category[];
    ratingsLookup: Record<string, Rating>;
    rowIndex: number;
    onActiveCell: (studentId: number, categoryId: number) => void;
};

function StudentRow({
    student,
    categories,
    ratingsLookup,
    rowIndex,
    onActiveCell,
}: StudentRowProps) {
    return (
        <>
            <div
                className={` flex flex-col items-center justify-center cursor-pointer hover:bg-[#D8CFBE] ${rowIndex % 2 === 0 ? 'bg-[#FAF6EE]' : ''}`}
            >
                {student.name}
            </div>
            {categories.map((category) => {
                const rating = ratingsLookup[`${student.id}-${category.id}`];
                const stripe = rowIndex % 2 === 0 ? 'bg-[#FAF6EE]' : '';
                const cellColor = rating ? LEVELS[rating.level].color : stripe;
                return (
                    <div
                        className={` flex flex-col p-2 items-center justify-center cursor-pointer ${stripe} hover:bg-[#D8CFBE]`}
                        onClick={() => onActiveCell(student.id, category.id)}
                        key={`${student.id}-${category.id}`}
                    >
                        {rating ? (
                            <div className="w-full">
                                <div
                                    className={`${cellColor} rounded-md m-2 `}
                                    style={{
                                        width: `${(rating.level / 4) * 100}%`,
                                    }}
                                >
                                    {rating.level}
                                </div>

                                <span className="text-[8px]">
                                    {rating ? LEVELS[rating.level].label : ''}
                                </span>
                            </div>
                        ) : (
                            <div className="border border-dashed p-1 rounded-md text-[10px]">
                                <span>+</span>
                                <span>Add score</span>
                            </div>
                        )}
                    </div>
                );
            })}
        </>
    );
}

export default StudentRow;
