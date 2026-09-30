import useSaveSummary from '../../hooks/useSaveSummary';
import useAddObservation from '../../hooks/useAddObservation';
import useArchiveObservation from '../../hooks/useArchiveObservation';
import { formatShortDate } from '../../utils/chartCoordinates';
import { type Observation } from '../../types';

type InteractionsSectionProps = {
    studentId: number;
    firstName: string;
    userId: string;
    isAdmin: boolean;
    initialSummary: string;
    activeObservationsNewestFirst: Observation[];
    refetchObservations: () => void;
};

const SAVE_STATUS_TEXT = {
    idle: 'Saved automatically as you type.',
    saving: 'Saving…',
    saved: 'Saved.',
    error: 'Could not save. Keep typing to retry.',
};

const sectionLabelClasses =
    'text-[11px] font-semibold uppercase tracking-wide text-[#8C8377] mb-1';

function InteractionsSection({
    studentId,
    firstName,
    userId,
    isAdmin,
    initialSummary,
    activeObservationsNewestFirst,
    refetchObservations,
}: InteractionsSectionProps) {
    const { summaryText, handleSummaryChange, saveStatus } = useSaveSummary(
        studentId,
        userId,
        initialSummary,
    );
    const { noteText, setNoteText, addObservationError, handleAddObservation, loading } =
        useAddObservation(refetchObservations);
    const { archiveObservationError, handleArchiveObservation } =
        useArchiveObservation(refetchObservations);

    return (
        <div className="bg-white rounded-2xl border border-[#EFEAE1] p-6 break-inside-avoid">
            <h2 className="text-lg font-bold text-[#2E2A24]">Individual & social interactions</h2>
            <p className="text-sm text-[#5C5343] mb-4">
                A running picture of how {firstName} works alone and with others.
            </p>

            <p className={sectionLabelClasses}>Summary</p>
            <textarea
                value={summaryText}
                onChange={(e) => handleSummaryChange(e.target.value)}
                rows={3}
                placeholder={`How does ${firstName} get on alone and with others?`}
                className="print:hidden w-full rounded-lg border border-[#ECE6DC] bg-[#FAF7F1] px-3 py-2 text-sm"
            />
            {/* textareas clip long text when printed, so print a plain paragraph instead */}
            <p className="hidden print:block text-sm whitespace-pre-wrap">
                {summaryText || 'No summary yet.'}
            </p>
            <p
                className={`print:hidden text-[11px] mb-4 ${saveStatus === 'error' ? 'text-red-600' : 'text-[#A39A8C]'}`}
            >
                {SAVE_STATUS_TEXT[saveStatus]}
            </p>

            <p className={`${sectionLabelClasses} print:mt-4`}>Observation log</p>
            <form
                className="print:hidden flex gap-2 mb-2"
                onSubmit={(e) => {
                    e.preventDefault();
                    handleAddObservation(studentId, userId);
                }}
            >
                <input
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    placeholder="Add an interaction note and press Enter…"
                    className="flex-1 rounded-lg border border-[#E6DDCE] px-3 py-2 text-sm"
                    type="text"
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-teal-700 hover:bg-teal-800 text-white rounded-lg px-4 py-2 text-sm font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Add note
                </button>
            </form>
            {(addObservationError || archiveObservationError) && (
                <p className="print:hidden text-red-600 text-sm mb-2">
                    {addObservationError || archiveObservationError}
                </p>
            )}

            {activeObservationsNewestFirst.length === 0 ? (
                <p className="text-sm text-[#A39A8C] py-2">No notes yet.</p>
            ) : (
                <ul>
                    {activeObservationsNewestFirst.map((observation) => (
                        <li
                            key={observation.id}
                            className="flex items-start gap-4 border-t border-[#F2EDE4] py-3 text-sm break-inside-avoid"
                        >
                            <span className="w-14 shrink-0 font-semibold text-[#8C8377]">
                                {formatShortDate(observation.created_at)}
                            </span>
                            <span className="flex-1 text-[#2E2A24] whitespace-pre-wrap">
                                {observation.note}
                            </span>
                            {isAdmin && (
                                <button
                                    onClick={() => handleArchiveObservation(observation.id)}
                                    aria-label="Remove note"
                                    className="print:hidden text-[#A39A8C] hover:text-[#B5402F] cursor-pointer px-1"
                                >
                                    ×
                                </button>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default InteractionsSection;
