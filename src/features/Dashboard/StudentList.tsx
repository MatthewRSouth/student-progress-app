import StudentRow from './StudentRow';
//types
import { type Rating, type Category, type Student } from '../../types';

type StudentListProps = {
    students: Student[];
    categories: Category[];
    ratingsLookup: Record<string, Rating>;
    activeCell: {
        studentId: number;
        categoryId: number;
    } | null;
    onActiveCell: (studentId: number, categoryId: number) => void;
};

function StudentList({
    students,
    categories,
    ratingsLookup,
    onActiveCell,
}: StudentListProps) {
    return (
        <>
            {students.map((student, rowIndex) => (
                <StudentRow
                    key={student.id}
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
