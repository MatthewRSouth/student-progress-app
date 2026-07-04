//types
type Category = { id: number; criteria: string };
type DashboardHeadersProps = {
    categories: Category[];
};

function DashboardHeaders({ categories }: DashboardHeadersProps) {
    return (
        <>
            <div>Student Name</div>
            {categories.map((category) => (
                <div key={`${category.id}`}>{category.criteria}</div>
            ))}
        </>
    );
}

export default DashboardHeaders;
