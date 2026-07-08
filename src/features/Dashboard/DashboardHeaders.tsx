//types
type Category = { id: number; criteria: string };
type DashboardHeadersProps = {
    categories: Category[];
};

function DashboardHeaders({ categories }: DashboardHeadersProps) {
    return (
        <>
            <div className="">Student Name</div>
            {categories.map((category) => (
                <div>{category.criteria}</div>
            ))}
        </>
    );
}

export default DashboardHeaders;
