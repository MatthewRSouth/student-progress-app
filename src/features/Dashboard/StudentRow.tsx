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
                        className={` flex flex-col p-2 items-center justify-center cursor-pointer hover:bg-[#D8CFBE] ${cellColor}`}
                        onClick={() => onActiveCell(student.id, category.id)}
                        key={`${student.id}-${category.id}`}
                    >
                        {rating ? rating.level : '+'}
                        <span className="text-[8px]">
                            {rating ? LEVELS[rating.level].label : ''}
                        </span>
                    </div>
                );
            })}
        </>
    );
}

export default StudentRow;
