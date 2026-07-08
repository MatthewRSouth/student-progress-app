//type
type Levels = Record<
    1 | 2 | 3 | 4,
    {
        color: string;
        label: string;
    }
>;

export const LEVELS: Levels = {
    1: { color: 'bg-[#E0604C]', label: 'Needs improvement' },
    2: { color: 'bg-[#E3A93E]', label: 'Getting there' },
    3: { color: 'bg-[#5BA567]', label: 'Doing well' },
    4: { color: 'bg-[#4D81B3]', label: 'Excellent' },
};

export const MODALLEVELS: Levels = {
    1: { color: 'bg-[#F8E1DB]', label: 'Needs improvement' },
    2: { color: 'bg-[#F8ECD4]', label: 'Getting there' },
    3: { color: 'bg-[#E2EFE2]', label: 'Doing well' },
    4: { color: 'bg-[#DEEAF3]', label: 'Excellent' },
};
