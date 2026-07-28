import StudentRow from './StudentRow';
//types
import { type Rating, type Category, type Student } from '../../types';

type StudentListProps = {
    students: Student[];
    categories: Category[];
    termId: number;
    ratingsLookup: Record<string, Rating>;
    onActiveCell: (studentId: number, categoryId: number) => void;
};

function StudentList({
    students,
    termId,
    categories,
    ratingsLookup,
    onActiveCell,
}: StudentListProps) {
    return (
        <>
            {students.map((student, rowIndex) => (
                <StudentRow
                    key={student.id}
                    termId={termId}
                    student={student}
                    categories={categories}
                    ratingsLookup={ratingsLookup}
                    rowIndex={rowIndex}
                    onActiveCell={onActiveCell}
                />
            ))}
        </>
    );
}

export default StudentList;
