export type Category = { id: number; criteria: string };
export type Student = { id: number; name: string };
export type Rating = {
    student_id: number;
    category_id: number;
    level: 1 | 2 | 3 | 4;
    created_at: string;
};
