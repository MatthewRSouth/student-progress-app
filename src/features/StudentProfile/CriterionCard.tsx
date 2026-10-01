import StatusPill from '../../ui/StatusPill';
import ProgressChart from './ProgressChart';
import { LEVELS } from '../../constants/levels';
import { formatShortDate } from '../../utils/chartCoordinates';
import { getCriteriaLabel } from '../../utils/criteriaLabels';
import { type Category, type Rating, type CriteriaLanguage } from '../../types';

type CriterionCardProps = {
    category: Category;
    childRatingsOldestFirst: Rating[];
    classRatingsForCriterion: Rating[];
    currentTermRating: Rating | undefined;
    showClassAverage: boolean;
    criteriaLanguage: CriteriaLanguage;
};

function CriterionCard({
    category,
    childRatingsOldestFirst,
    classRatingsForCriterion,
    currentTermRating,
    showClassAverage,
    criteriaLanguage,
}: CriterionCardProps) {
    const latestRating = childRatingsOldestFirst[childRatingsOldestFirst.length - 1];

    return (
        <div className="bg-white rounded-2xl border border-[#EFEAE1] p-5 break-inside-avoid">
            <div className="flex justify-between items-start gap-3">
                {/* The language toggle only affects the screen: the printed page always uses the Japanese name */}
                <h3 className="font-semibold text-[#2E2A24]">
                    <span className="print:hidden">
                        {getCriteriaLabel(category, criteriaLanguage)}
                    </span>
                    <span className="hidden print:inline">{category.criteria}</span>
                </h3>
                {currentTermRating ? (
                    <StatusPill level={currentTermRating.level} />
                ) : (
                    <span className="text-[11px] text-[#8C8377] whitespace-nowrap">
                        Not rated this term
                    </span>
                )}
            </div>

            {latestRating ? (
                <>
                    <div className="my-3">
                        <ProgressChart
                            childRatingsOldestFirst={childRatingsOldestFirst}
                            classRatingsForCriterion={classRatingsForCriterion}
                            showClassAverage={showClassAverage}
                        />
                    </div>
                    <div className="bg-[#FAF7F1] rounded-lg px-3 py-2">
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-[#8C8377]">
                            Latest rating · {formatShortDate(latestRating.created_at)}
                        </p>
                        <p className="text-sm text-[#2E2A24]">
                            {LEVELS[latestRating.level].label}
                        </p>
                    </div>
                </>
            ) : (
                <p className="text-sm text-[#8C8377] my-10 text-center">No ratings yet</p>
            )}
        </div>
    );
}

export default CriterionCard;
