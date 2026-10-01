import { type Category, type CriteriaLanguage } from '../types';

// The on-screen name for a criterion. English falls back to Japanese when no English name is set.
export function getCriteriaLabel(
    category: Category,
    criteriaLanguage: CriteriaLanguage,
) {
    if (criteriaLanguage === 'en' && category.criteria_en) {
        return category.criteria_en;
    }
    return category.criteria;
}

// Both names together, for hover text: "Japanese / English", or just Japanese when there is no English
export function getBilingualCriteriaName(category: Category) {
    return category.criteria_en
        ? `${category.criteria} / ${category.criteria_en}`
        : category.criteria;
}
