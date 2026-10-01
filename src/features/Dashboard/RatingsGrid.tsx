import DashboardHeaders from './DashboardHeaders';
import StudentList from './StudentList';
//types
import {
    type Rating,
    type Category,
    type Student,
    type CriteriaLanguage,
} from '../../types';

// Below this width a criterion column can't show its 100px progress bar plus cell padding,
// so the grid scrolls sideways instead of squeezing the columns further
const NAME_COLUMN_WIDTH_PX = 200;
const CRITERION_COLUMN_MIN_WIDTH_PX = 120;

type RatingsGridProps = {
    students: Student[];
    categories: Category[];
    criteriaLanguage: CriteriaLanguage;
    termId: number;
    ratingsLookup: Record<string, Rating>;
    onActiveCell: (studentId: number, categoryId: number) => void;
    children?: React.ReactNode;
};

function RatingsGrid({
    students,
    categories,
    criteriaLanguage,
    termId,
    ratingsLookup,
    onActiveCell,
    children,
}: RatingsGridProps) {
    return (
        <div className="flex justify-start items-center bg-white w-[95vw] rounded-lg mt-4 py-2 overflow-x-auto">
            <div
                className="grid text-center w-full"
                style={{
                    gridTemplateColumns: `${NAME_COLUMN_WIDTH_PX}px repeat(${categories.length}, minmax(${CRITERION_COLUMN_MIN_WIDTH_PX}px, 1fr))`,
                    minWidth:
                        NAME_COLUMN_WIDTH_PX +
                        categories.length * CRITERION_COLUMN_MIN_WIDTH_PX,
                }}
            >
                <DashboardHeaders
                    categories={categories}
                    criteriaLanguage={criteriaLanguage}
                ></DashboardHeaders>
                <StudentList
                    termId={termId}
                    students={students}
                    categories={categories}
                    ratingsLookup={ratingsLookup}
                    onActiveCell={onActiveCell}
                ></StudentList>
                {children}
            </div>
        </div>
    );
}

export default RatingsGrid;
