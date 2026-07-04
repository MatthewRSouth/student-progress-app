import React from 'react';
//types
type Student = { id: number; name: string };
type Category = { id: number; criteria: string };
type StudentListProps = {
    students: Student[];
    categories: Category[];
};

function StudentList({ students, categories }: StudentListProps) {
    return (
        <div className="grid grid-cols-[200px_repeat(4,112px)] text-center">
            {students.map((student) => (
                <React.Fragment key={student.id}>
                    <div>{student.name}</div>
                    {categories.map((category) => (
                        <div key={`${student.id}-${category.id}`}></div>
                    ))}
                </React.Fragment>
            ))}
        </div>
    );
}

export default StudentList;
