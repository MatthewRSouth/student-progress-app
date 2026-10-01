import { useState } from 'react';
import { type CriteriaLanguage } from '../types';

const CRITERIA_LANGUAGE_STORAGE_KEY = 'criteriaLanguage';

// localStorage can throw (private browsing, blocked storage), so fall back to Japanese
function readStoredCriteriaLanguage(): CriteriaLanguage {
    try {
        return localStorage.getItem(CRITERIA_LANGUAGE_STORAGE_KEY) === 'en'
            ? 'en'
            : 'ja';
    } catch {
        return 'ja';
    }
}

// Which language criteria names are shown in on screen. Remembered per browser, so each
// teacher keeps their own choice across reloads and between the dashboard and profiles.
function useCriteriaLanguage() {
    const [criteriaLanguage, setCriteriaLanguage] = useState<CriteriaLanguage>(
        readStoredCriteriaLanguage,
    );

    function changeCriteriaLanguage(newCriteriaLanguage: CriteriaLanguage) {
        setCriteriaLanguage(newCriteriaLanguage);
        try {
            localStorage.setItem(
                CRITERIA_LANGUAGE_STORAGE_KEY,
                newCriteriaLanguage,
            );
        } catch (err) {
            console.error(err);
        }
    }

    return { criteriaLanguage, changeCriteriaLanguage };
}

export default useCriteriaLanguage;
