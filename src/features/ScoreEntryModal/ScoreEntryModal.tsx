import { useState, useEffect } from 'react';
//Custom Hooks
import useRateStudent from '../../hooks/useRateStudent';
//Component Imports
import ModalContainer from '../../ui/ModalContainer';
import StatusPill from '../../ui/StatusPill';
import ProgressChart from '../StudentProfile/ProgressChart';
import EarlierNotesList from './EarlierNotesList';
//utils & constants
import { LEVELS, MODALLEVELS } from '../../constants/levels';
import { RATING_NOTE_MAX_LENGTH } from '../../constants/ratings';
import { getNotedRatingsNewestFirst } from '../../utils/ratingNotes';
//types
import { type Rating } from '../../types';

// Takes plain data and callbacks (no fetching, no page-specific state),
// so it can be opened from any page that has a student and a criterion
type ScoreEntryModalProps = {
    studentId: number;
    studentName: string;
    className: string;
    categoryId: number;
    criteriaLabel: string;
    termId: number | null;
    userId: string;
    currentTermRating: Rating | undefined;
    childRatingsOldestFirst: Rating[];
    classRatingsForCriterion: Rating[];
    showClassAverage: boolean;
    refetchRatings: () => void;
    onClose: () => void;
};

const sectionLabelClasses =
    'text-[11px] font-semibold uppercase tracking-wide text-[#8C8377] mb-1';

function ScoreEntryModal({
    studentId,
    studentName,
    className,
    categoryId,
    criteriaLabel,
    termId,
    userId,
    currentTermRating,
    childRatingsOldestFirst,
    classRatingsForCriterion,
    showClassAverage,
    refetchRatings,
    onClose,
}: ScoreEntryModalProps) {
    // The hook lives here, so each time the modal opens nothing is preselected and no old error shows
    const { rating, setRating, error, isSaving, handleRating } = useRateStudent(
        refetchRatings,
        onClose,
    );
    const [noteText, setNoteText] = useState('');

    useEffect(() => {
        const closeOnEscape = (keyboardEvent: KeyboardEvent) => {
            // Escape also cancels Japanese IME text; that keypress must not close the modal
            if (keyboardEvent.key === 'Escape' && !keyboardEvent.isComposing) {
                onClose();
            }
        };
        document.addEventListener('keydown', closeOnEscape);
        return () => document.removeEventListener('keydown', closeOnEscape);
    }, [onClose]);

    const notedRatingsNewestFirst = getNotedRatingsNewestFirst(
        childRatingsOldestFirst,
    );

    return (
        // The modal is a screen-only tool: it never appears on the printed profile
        <div className="print:hidden">
            <ModalContainer onClose={onClose}>
                {/* Scrolls inside the modal when the content is taller than the window */}
                <div className="max-h-[calc(90vh-3rem)] overflow-y-auto px-1">
                    {/* Header */}
                    <div className="flex justify-between items-start gap-3">
                        <div>
                            <p className="text-[11px] font-semibold uppercase tracking-wide text-[#8C8377]">
                                {className} · {studentName}
                            </p>
                            <h2 className="text-xl font-bold text-[#2E2A24]">
                                {criteriaLabel}
                            </h2>
                        </div>
                        <button
                            type="button"
                            onClick={onClose}
                            aria-label="Close"
                            className="flex items-center justify-center rounded-full h-7 w-7 shrink-0 bg-[#F4EFE6] hover:bg-[#EFE7D8] cursor-pointer"
                        >
                            ×
                        </button>
                    </div>

                    {/* Current */}
                    <div className="flex items-center gap-2 text-sm text-[#5C5343] my-3">
                        Current
                        {currentTermRating ? (
                            <StatusPill level={currentTermRating.level} />
                        ) : (
                            <span className="text-[11px] text-[#8C8377]">
                                Not rated this term
                            </span>
                        )}
                    </div>

                    {/* Recent progress */}
                    <div className="flex justify-between items-center">
                        <p className={sectionLabelClasses}>Recent progress</p>
                        <div className="flex items-center gap-3 text-[11px] text-[#5C5343]">
                            <span className="flex items-center gap-1.5">
                                <span className="inline-block w-4 border-t-2 border-[#2E2A24]" />
                                This child
                            </span>
                            {showClassAverage && (
                                <span className="flex items-center gap-1.5">
                                    <span className="inline-block w-4 border-t-2 border-dashed border-[#18605C]/60" />
                                    Class avg
                                </span>
                            )}
                        </div>
                    </div>
                    {childRatingsOldestFirst.length === 0 ? (
                        <p className="text-sm text-[#8C8377] my-6 text-center">
                            No ratings yet
                        </p>
                    ) : (
                        <div className="mb-3">
                            <ProgressChart
                                childRatingsOldestFirst={childRatingsOldestFirst}
                                classRatingsForCriterion={classRatingsForCriterion}
                                showClassAverage={showClassAverage}
                                showLevelMarkers
                            />
                        </div>
                    )}

                    {/* Set new score */}
                    <p className={sectionLabelClasses}>Set new score</p>
                    <div className="grid grid-cols-4 gap-2 mb-4 p-1">
                        {([1, 2, 3, 4] as const).map((level) => {
                            const isSelected = rating === level;
                            return (
                                <button
                                    key={level}
                                    type="button"
                                    onClick={() => setRating(level)}
                                    aria-pressed={isSelected}
                                    className={`flex flex-col items-center justify-center rounded-xl px-1 py-2 min-h-16 cursor-pointer text-[#2E2A24] ${
                                        isSelected
                                            ? `${LEVELS[level].color} ring-2 ring-offset-2 ring-[#2E2A24]`
                                            : `${MODALLEVELS[level].color} hover:opacity-80`
                                    }`}
                                >
                                    <span className="text-lg font-semibold">
                                        {level}
                                    </span>
                                    <span className="text-[9px] leading-tight text-center">
                                        {LEVELS[level].label}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Observation note */}
                    <label className={`${sectionLabelClasses} block`}>
                        Observation note
                        <textarea
                            value={noteText}
                            onChange={(e) => setNoteText(e.target.value)}
                            maxLength={RATING_NOTE_MAX_LENGTH}
                            rows={3}
                            placeholder="What did you observe? (optional)"
                            className="block w-full mt-1 rounded-lg border border-[#ECE6DC] bg-[#FAF7F1] px-3 py-2 text-sm font-normal normal-case tracking-normal text-[#2E2A24]"
                        />
                    </label>

                    {/* Earlier notes */}
                    <p className={`${sectionLabelClasses} mt-4`}>Earlier notes</p>
                    <EarlierNotesList
                        notedRatingsNewestFirst={notedRatingsNewestFirst}
                    />

                    {/* Cancel / Save */}
                    <div className="flex gap-2 mt-4">
                        <button
                            onClick={onClose}
                            type="button"
                            className="bg-[#F4EFE6] rounded-lg px-4 py-2 font-semibold cursor-pointer hover:bg-[#EFE7D8]"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            disabled={rating === 0 || isSaving}
                            onClick={(e) =>
                                handleRating(
                                    e,
                                    { studentId, categoryId },
                                    termId,
                                    userId,
                                    noteText,
                                )
                            }
                            className="flex-1 bg-teal-700 hover:bg-teal-800 text-white rounded-lg px-4 py-2 font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSaving ? 'Saving…' : 'Save score'}
                        </button>
                    </div>
                    {error && (
                        <p className="text-red-600 text-sm text-center mt-2">
                            {error}
                        </p>
                    )}
                </div>
            </ModalContainer>
        </div>
    );
}

export default ScoreEntryModal;
