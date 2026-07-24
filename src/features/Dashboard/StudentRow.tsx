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
    const studentRatings = categories
        .map((category) => ratingsLookup[`${student.id}-${category.id}`])
        .filter((rating) => rating !== undefined);

    const getAverage = (ratings: Rating[]): number | null => {
        if (ratings.length === 0) return null;
        const sum = ratings.reduce((total, r) => total + r.level, 0);
        return sum / ratings.length;
    };

    const getInitials = (name: string) => {
        //get name, get the first letter, slice at space, get the first letter of the last name and join them.

        return name
            .trim()
            .split(/\s+/)
            .map((word) => word[0])
            .slice(0, 2)
            .join('')
            .toUpperCase();
    };

    const avg = getAverage(studentRatings);

    const getRandAvatarColor = (id: number) => {
        const avatarColors = ['#F8E1DB', '#F8ECD4', '#E2EFE2', '#DEEAF3'];

        return avatarColors[id % avatarColors.length];
    };

    return (
        <>
            <div
                className={`flex justify-start items-center cursor-pointer hover:bg-[#D8CFBE] ${rowIndex % 2 === 0 ? 'bg-[#FAF6EE]' : ''}`}
            >
                <div
                    className={`rounded-full  w-10 h-10 flex items-center justify-center text-white shrink-0 `}
                    style={{ backgroundColor: getRandAvatarColor(student.id) }}
                >
                    {getInitials(student.name)}
                </div>

                <div className="flex flex-col mx-5">
                    <span>{student.name}</span>
                    <span className="text-[8px]">
                        {avg === null
                            ? 'No scores yet'
                            : `avg. ${avg.toFixed(1)}`}
                    </span>
                </div>
            </div>
            {categories.map((category) => {
                const rating = ratingsLookup[`${student.id}-${category.id}`];
                const stripe = rowIndex % 2 === 0 ? 'bg-[#FAF6EE]' : '';
                const cellColor = rating ? LEVELS[rating.level].color : stripe;

                return (
                    <div
                        className={` flex flex-col p-2 items-center justify-start cursor-pointer ${stripe} hover:bg-[#D8CFBE]`}
                        onClick={() => {
                            onActiveCell(student.id, category.id);
                        }}
                        key={`${student.id}-${category.id}`}
                    >
                        {rating ? (
                            //track
                            <>
                                <div className="w-full max-w-25 h-full overflow-hidden text-center items-center justify-center bg-[#E8E0D0] rounded-lg">
                                    {/* fill */}
                                    <div
                                        className={`${cellColor} rounded-lg text-start`}
                                        style={{
                                            width: `${(rating.level / 4) * 100}%`,
                                        }}
                                    >
                                        {
                                            <span className="mx-1.5">
                                                {rating.level}
                                            </span>
                                        }
                                    </div>
                                </div>
                                <span className="text-[8px]">
                                    {rating ? LEVELS[rating.level].label : ''}
                                </span>
                            </>
                        ) : (
                            <div className="border border-dashed p-1 rounded-md text-[10px]">
                                <span>+</span>
                                <span> Add score</span>
                            </div>
                        )}
                    </div>
                );
            })}
        </>
    );
}

export default StudentRow;
