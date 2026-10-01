import { useState } from 'react';
import { CRITERIA_MAX_LENGTH } from '../../constants/criteria';
import { type CriteriaNameChanges } from '../../hooks/useEditCriteria';
import { type Category } from '../../types';

type CriteriaRowProps = {
    category: Category;
    isAdmin: boolean;
    onUpdateCriteria: (
        categoryId: number,
        nameChanges: CriteriaNameChanges,
    ) => Promise<boolean>;
    onArchiveCriteria: (categoryId: number) => Promise<boolean>;
};

const inputClasses =
    'w-full rounded-lg border border-[#E6DDCE] bg-white px-3 py-2 text-sm focus:outline-teal-700 read-only:bg-[#FAF7F1] read-only:focus:outline-none';

function CriteriaRow({
    category,
    isAdmin,
    onUpdateCriteria,
    onArchiveCriteria,
}: CriteriaRowProps) {
    const savedEnglishName = category.criteria_en ?? '';
    // Drafts hold what is typed; nothing is written until the input loses focus or Enter is pressed
    const [criteriaDraft, setCriteriaDraft] = useState(category.criteria);
    const [englishNameDraft, setEnglishNameDraft] = useState(savedEnglishName);
    const [isConfirmingArchive, setIsConfirmingArchive] = useState(false);

    async function saveCriteriaName() {
        const trimmedCriteria = criteriaDraft.trim();
        setCriteriaDraft(trimmedCriteria);
        if (trimmedCriteria === category.criteria) return;

        const wasSaved = await onUpdateCriteria(category.id, {
            criteria: trimmedCriteria,
        });
        if (!wasSaved) setCriteriaDraft(category.criteria);
    }

    async function saveEnglishName() {
        const trimmedEnglishName = englishNameDraft.trim();
        setEnglishNameDraft(trimmedEnglishName);
        if (trimmedEnglishName === savedEnglishName) return;

        const wasSaved = await onUpdateCriteria(category.id, {
            criteria_en: trimmedEnglishName === '' ? null : trimmedEnglishName,
        });
        if (!wasSaved) setEnglishNameDraft(savedEnglishName);
    }

    // Enter saves through the same path as clicking away
    const blurOnEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
        // Enter also confirms Japanese IME text; that keypress must not save
        if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
            e.currentTarget.blur();
        }
    };

    return (
        <li className="flex items-start gap-2 border-t border-[#F2EDE4] py-3">
            <div className="flex-1 flex flex-col gap-1.5">
                <input
                    value={criteriaDraft}
                    onChange={(e) => setCriteriaDraft(e.target.value)}
                    onBlur={saveCriteriaName}
                    onKeyDown={blurOnEnter}
                    readOnly={!isAdmin}
                    maxLength={CRITERIA_MAX_LENGTH}
                    aria-label="Criteria name"
                    className={inputClasses}
                    type="text"
                />
                <input
                    value={englishNameDraft}
                    onChange={(e) => setEnglishNameDraft(e.target.value)}
                    onBlur={saveEnglishName}
                    onKeyDown={blurOnEnter}
                    readOnly={!isAdmin}
                    maxLength={CRITERIA_MAX_LENGTH}
                    placeholder={isAdmin ? 'English name (optional)' : 'No English name'}
                    aria-label={`English name for ${category.criteria}`}
                    className={inputClasses}
                    type="text"
                />
            </div>
            {isAdmin &&
                (isConfirmingArchive ? (
                    <div className="flex flex-col items-center gap-1 text-xs">
                        <span className="text-[#5C5343]">Archive?</span>
                        <div className="flex gap-1">
                            <button
                                type="button"
                                onClick={() => onArchiveCriteria(category.id)}
                                className="rounded-md bg-[#B5402F] text-white font-semibold px-2 py-1 cursor-pointer hover:opacity-90"
                            >
                                Yes
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsConfirmingArchive(false)}
                                className="rounded-md bg-[#F4EFE6] font-semibold px-2 py-1 cursor-pointer hover:bg-[#EFE7D8]"
                            >
                                No
                            </button>
                        </div>
                    </div>
                ) : (
                    <button
                        type="button"
                        onClick={() => setIsConfirmingArchive(true)}
                        aria-label={`Archive ${category.criteria}`}
                        className="h-9 w-9 shrink-0 rounded-lg bg-[#F8E1DB] text-[#B5402F] cursor-pointer hover:opacity-80"
                    >
                        ×
                    </button>
                ))}
        </li>
    );
}

export default CriteriaRow;
