export type Category = {
    id: number;
    criteria: string;
    class_id: number;
    is_active: boolean;
};
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
