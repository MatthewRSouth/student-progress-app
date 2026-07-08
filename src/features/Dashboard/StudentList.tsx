import React from 'react';
import { LEVELS } from '../../constants/levels';
//types
type Student = { id: number; name: string };
type Category = { id: number; criteria: string };
type Rating = {
    student_id: number;
    category_id: number;
    level: 1 | 2 | 3 | 4;
    created_at: string;
};
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
                <React.Fragment key={student.id}>
                    <div
                        className={` flex flex-col items-center justify-center cursor-pointer hover:bg-[#D8CFBE] ${rowIndex % 2 === 0 ? 'bg-[#FAF6EE]' : ''}`}
                    >
                        {student.name}
                    </div>
                    {categories.map((category) => {
                        const rating =
                            ratingsLookup[`${student.id}-${category.id}`];
                        const stripe = rowIndex % 2 === 0 ? 'bg-[#FAF6EE]' : '';
                        const cellColor = rating
                            ? LEVELS[rating.level].color
                            : stripe;
                        return (
                            <div
                                className={` flex flex-col p-2 items-center justify-center cursor-pointer hover:bg-[#D8CFBE] ${cellColor}`}
                                onClick={() =>
                                    onActiveCell(student.id, category.id)
                                }
                                key={`${student.id}-${category.id}`}
                            >
                                {rating ? rating.level : '+'}
                                <span className="text-[8px]">
                                    {rating ? LEVELS[rating.level].label : ''}
                                </span>
                            </div>
                        );
                    })}
                </React.Fragment>
            ))}
        </>
    );
}

export default StudentList;
