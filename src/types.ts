export type Category = { id: number; criteria: string; class_id: number };
export type Student = { id: number; name: string; class_id: number };
export type Rating = {
    student_id: number;
    category_id: number;
    level: 1 | 2 | 3 | 4;
    created_at: string;
};
export type Term = { id: number; term: string };

export type Class = { id: number; name: string };
