export type Category = {
    id: number;
    criteria: string;
    criteria_en: string | null;
    class_id: number;
    is_active: boolean;
};
// Language the criteria names are shown in on screen
export type CriteriaLanguage = 'ja' | 'en';

export type Student = {
    id: number;
    name: string;
    class_id: number;
    is_active: boolean;
};
export type Rating = {
    student_id: number;
    category_id: number;
    level: 1 | 2 | 3 | 4;
    created_at: string;
    term_id: number;
    // Optional observation saved with the rating. Only present where the fetch selects it.
    note?: string | null;
};
export type Term = { id: number; term: string; created_at: string };

export type Cls = { id: number; name: string };

export type Observation = {
    id: number;
    student_id: number;
    note: string;
    user_id: string;
    is_active: boolean;
    created_at: string;
};

export type StudentSummary = {
    student_id: number;
    summary: string;
    updated_at: string;
};

export type UserProfile = { id: string; role: string };
