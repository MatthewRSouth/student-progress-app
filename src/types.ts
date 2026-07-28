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
