import StatusPill from '../../ui/StatusPill';
import ProgressChart from './ProgressChart';
import { LEVELS } from '../../constants/levels';
import { formatShortDate } from '../../utils/chartCoordinates';
import { getCriteriaLabel } from '../../utils/criteriaLabels';
import { getNotedRatingsNewestFirst } from '../../utils/ratingNotes';
import { type Category, type Rating, type CriteriaLanguage } from '../../types';

type CriterionCardProps = {
    category: Category;
    childRatingsOldestFirst: Rating[];
    classRatingsForCriterion: Rating[];
    currentTermRating: Rating | undefined;
    showClassAverage: boolean;
    criteriaLanguage: CriteriaLanguage;
    onOpenScoreEntry: () => void;
};

function CriterionCard({
    category,
    childRatingsOldestFirst,
    classRatingsForCriterion,
    currentTermRating,
    showClassAverage,
    criteriaLanguage,
    onOpenScoreEntry,
}: CriterionCardProps) {
    const latestRating = childRatingsOldestFirst[childRatingsOldestFirst.length - 1];
    const latestNotedRating = getNotedRatingsNewestFirst(childRatingsOldestFirst)[0];
    const criteriaLabel = getCriteriaLabel(category, criteriaLanguage);

    const openOnEnterOrSpace = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onOpenScoreEntry();
        }
    };

    // A div with button semantics: the card holds a heading and a chart, which a <button> may not contain
    return (
        <div
            role="button"
            tabIndex={0}
            onClick={onOpenScoreEntry}
            onKeyDown={openOnEnterOrSpace}
            aria-label={`Enter a score for ${criteriaLabel}`}
            className="bg-white rounded-2xl border border-[#EFEAE1] p-5 break-inside-avoid cursor-pointer hover:border-[#E6DDCE] focus-visible:outline-2 focus-visible:outline-teal-700"
        >
            <div className="flex justify-between items-start gap-3">
                {/* The language toggle only affects the screen: the printed page always uses the Japanese name */}
                <h3 className="font-semibold text-[#2E2A24]">
                    <span className="print:hidden">{criteriaLabel}</span>
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
                    {/* Notes are for teachers only: the printed page shows the latest rating instead */}
                    {latestNotedRating && (
                        <div className="print:hidden bg-[#FAF7F1] rounded-lg px-3 py-2">
                            <p className="text-[10px] font-semibold uppercase tracking-wide text-[#8C8377]">
                                Latest note · {formatShortDate(latestNotedRating.created_at)}
                            </p>
                            <p className="text-sm text-[#2E2A24] whitespace-pre-wrap line-clamp-3">
                                {latestNotedRating.note}
                            </p>
                        </div>
                    )}
                    <div
                        className={`bg-[#FAF7F1] rounded-lg px-3 py-2 ${latestNotedRating ? 'hidden print:block' : ''}`}
                    >
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
