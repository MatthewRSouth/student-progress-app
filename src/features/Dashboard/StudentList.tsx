import React from 'react';
//types
type Student = { id: number; name: string };
type Category = { id: number; criteria: string };
type Rating = {
    student_id: number;
    category_id: number;
    level: number;
    created_at: string;
};
type StudentListProps = {
    students: Student[];
    categories: Category[];
    ratingsLookup: Record<string, Rating>;
};

function StudentList({
    students,
    categories,
    ratingsLookup,
}: StudentListProps) {
    return (
        <>
            {students.map((student) => (
                <React.Fragment key={student.id}>
                    <div>{student.name}</div>
                    {categories.map((category) => {
                        const rating =
                            ratingsLookup[`${student.id}-${category.id}`];
                        return (
                            <div key={`${student.id}-${category.id}`}>
                                {rating ? rating.level : ''}
                            </div>
                        );
                    })}
                </React.Fragment>
            ))}
        </>
    );
}

export default StudentList;
