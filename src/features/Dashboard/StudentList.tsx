//types
type Student = { id: number; name: string };
type studentListProps = {
    students: Student[];
};

function StudentList({ students }: studentListProps) {
    return (
        <div className="grid grid-cols-[repeat(1,200px)] text-center grid-rows-[repeat(4,50px)]">
            {students.map((student) => (
                <div key={student.id}>{student.name}</div>
            ))}
        </div>

        // <div >
        //             <span className="rounded-full bg-blue-300 p-4 mx-5 mt-2 text-blue-700">
        //                 MS
        //             </span>
        //             <p>Matthew</p>
        //         </div>
    );
}

export default StudentList;
