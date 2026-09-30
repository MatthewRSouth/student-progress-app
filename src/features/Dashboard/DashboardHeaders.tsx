//types
import { type Category } from '../../types';

type DashboardHeadersProps = {
    categories: Category[];
};

function DashboardHeaders({ categories }: DashboardHeadersProps) {
    return (
        <>
            <div className="sticky left-0 z-10 pl-2 bg-white border-r border-[#F2EDE4]">
                Student Name
            </div>
            {categories.map((category) => (
                <div className="truncate" title={category.criteria} key={category.id}>
                    {category.criteria}
                </div>
            ))}
        </>
    );
}

export default DashboardHeaders;
