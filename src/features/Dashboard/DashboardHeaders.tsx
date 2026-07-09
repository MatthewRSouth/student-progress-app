//types
import { type Category } from '../../types';

type DashboardHeadersProps = {
    categories: Category[];
};

function DashboardHeaders({ categories }: DashboardHeadersProps) {
    return (
        <>
            <div className="">Student Name</div>
            {categories.map((category) => (
                <div key={category.id}>{category.criteria}</div>
            ))}
        </>
    );
}

export default DashboardHeaders;
