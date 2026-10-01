import { LEVELS } from '../../constants/levels';
import { formatShortDate } from '../../utils/chartCoordinates';
import { type NotedRating } from '../../utils/ratingNotes';

const MAX_EARLIER_NOTES = 5;

type EarlierNotesListProps = {
    notedRatingsNewestFirst: NotedRating[];
};

function EarlierNotesList({ notedRatingsNewestFirst }: EarlierNotesListProps) {
    if (notedRatingsNewestFirst.length === 0) {
        return <p className="text-sm text-[#A39A8C] py-2">No notes yet.</p>;
    }

    return (
        <ul>
            {notedRatingsNewestFirst
                .slice(0, MAX_EARLIER_NOTES)
                .map((notedRating, noteIndex) => (
                    <li
                        key={`${notedRating.created_at}-${noteIndex}`}
                        className="flex items-start gap-2 border-t border-[#F2EDE4] py-2"
                    >
                        {/* Dot in the colour of the score this note was saved with */}
                        <span
                            className={`${LEVELS[notedRating.level].color} h-2 w-2 rounded-full shrink-0 mt-1.5`}
                            title={LEVELS[notedRating.level].label}
                        />
                        <div>
                            <p className="text-[11px] text-[#8C8377]">
                                {formatShortDate(notedRating.created_at)}
                            </p>
                            <p className="text-sm text-[#2E2A24] whitespace-pre-wrap">
                                {notedRating.note}
                            </p>
                        </div>
                    </li>
                ))}
        </ul>
    );
}

export default EarlierNotesList;
