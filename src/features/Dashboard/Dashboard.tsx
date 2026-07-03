import DashboardHeaders from './DashboardHeaders';
import StudentList from './StudentList';
import useFetch from '../../hooks/useFetch';

//types
type Category = { id: number; criteria: string };
type Student = { id: number; name: string };

function Dashboard() {
    const { data: categories, error: categoriesError } = useFetch<Category>(
        'categories',
        'id, criteria',
    );
    const { data: students, error: studentsError } = useFetch<Student>(
        'students',
        'id, name',
    );

    if (categoriesError || studentsError) {
        return <p>There was an error loading teh dashboard.</p>;
    }
    return (
        <>
            <DashboardHeaders categories={categories}></DashboardHeaders>
            <StudentList students={students}></StudentList>
        </>
    );
}

export default Dashboard;
