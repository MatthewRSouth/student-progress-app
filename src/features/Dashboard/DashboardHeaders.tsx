//types
type Category = { id: number; criteria: string };
type DashboardHeadersProps = {
    categories: Category[];
};

function DashboardHeaders({ categories }: DashboardHeadersProps) {
    return (
        <div className="grid grid-cols-[200px_repeat(5,112px)] text-center mt-5">
            <div>Student Name</div>
            {categories.map((category) => (
                <div key={category.id}>{category.criteria}</div>
            ))}
        </div>
    );
}

export default DashboardHeaders;
