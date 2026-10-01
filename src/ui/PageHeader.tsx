import { LEVELS } from '../constants/levels';

import SignOutBtn from '../features/Dashboard/SignOutBtn';
import { type CriteriaLanguage } from '../types';

type PageHeaderProps = {
    handleSignOut: () => void;
    criteriaLanguage: CriteriaLanguage;
    onChangeCriteriaLanguage: (criteriaLanguage: CriteriaLanguage) => void;
};

const CRITERIA_LANGUAGE_OPTIONS: { language: CriteriaLanguage; label: string }[] =
    [
        { language: 'ja', label: '日本語' },
        { language: 'en', label: 'English' },
    ];

function PageHeader({
    handleSignOut,
    criteriaLanguage,
    onChangeCriteriaLanguage,
}: PageHeaderProps) {
    return (
        <div className="flex justify-between items-center">
            <div className="flex mx-4">
                <div className="flex items-center justify-center rounded-lg h-10 w-10 bg-teal-700 p-6 text-white">
                    <span className="font-bold text-2xl">H</span>
                </div>
                <div className="flex flex-col mx-4">
                    <h1 className="font-bold text-center text-xl">
                        Progress Tracker
                    </h1>
                    <small>Hoshida International</small>
                </div>
            </div>
            <div className="flex items-center ">
                <div className=" flex mx-4 gap-3">
                    {Object.entries(LEVELS).map(([level, { color, label }]) => (
                        <div key={level} className="flex items-center">
                            <div
                                className={`rounded-md ${color} h-4 w-4 mx-2`}
                            ></div>
                            <p className="text-[10px] whitespace-nowrap">
                                {label}
                            </p>
                        </div>
                    ))}
                </div>
                {/* Language of the criteria names on screen; printed pages always use Japanese */}
                <div
                    className="flex items-center gap-1 mx-4 text-[10px]"
                    role="group"
                    aria-label="Criteria language"
                >
                    <span className="whitespace-nowrap mr-1">Criteria</span>
                    {CRITERIA_LANGUAGE_OPTIONS.map(({ language, label }) => (
                        <button
                            key={language}
                            type="button"
                            onClick={() => onChangeCriteriaLanguage(language)}
                            aria-pressed={criteriaLanguage === language}
                            className={`px-2 py-1 rounded-md cursor-pointer whitespace-nowrap ${
                                criteriaLanguage === language
                                    ? 'bg-teal-700 text-white'
                                    : 'hover:bg-teal-800 hover:text-white'
                            }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>
                <SignOutBtn onHandleSignout={handleSignOut} />
            </div>
        </div>
    );
}

export default PageHeader;
