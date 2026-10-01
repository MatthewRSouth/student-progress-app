import {
    getCriteriaLabel,
    getBilingualCriteriaName,
} from '../../utils/criteriaLabels';
//types
import { type Category, type CriteriaLanguage } from '../../types';

type DashboardHeadersProps = {
    categories: Category[];
    criteriaLanguage: CriteriaLanguage;
};

function DashboardHeaders({
    categories,
    criteriaLanguage,
}: DashboardHeadersProps) {
    return (
        <>
            <div className="sticky left-0 z-10 pl-2 bg-white border-r border-[#F2EDE4]">
                Student Name
            </div>
            {categories.map((category) => (
                <div
                    className="truncate"
                    title={getBilingualCriteriaName(category)}
                    key={category.id}
                >
                    {getCriteriaLabel(category, criteriaLanguage)}
                </div>
            ))}
        </>
    );
}

export default DashboardHeaders;
