//type
type Levels = Record<
    1 | 2 | 3 | 4,
    {
        color: string;
        label: string;
    }
>;

export const LEVELS: Levels = {
    1: { color: 'bg-red-500', label: 'Needs improvement' },
    2: { color: 'bg-yellow-500', label: 'Getting there' },
    3: { color: 'bg-green-500', label: 'Doing well' },
    4: { color: 'bg-blue-500', label: 'Excellent' },
};
