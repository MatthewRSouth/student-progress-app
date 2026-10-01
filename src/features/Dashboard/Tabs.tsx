import { type Cls } from '../../types';
type TabProps = {
    selectedClassId: number | null;
    classes: Cls[];
    onSelectClass: (classId: number) => void;
    isArchivedViewSelected: boolean;
    onSelectArchivedView: () => void;
};

function Tabs({
    selectedClassId,
    onSelectClass,
    classes,
    isArchivedViewSelected,
    onSelectArchivedView,
}: TabProps) {
    return (
        <div className="flex justify-start my-4 mx-4 gap-2">
            {classes.map((c) => (
                <button
                    key={c.id}
                    onClick={() => onSelectClass(c.id)}
                    className={`px-4 py-2 rounded-md cursor-pointer ${
                        !isArchivedViewSelected && selectedClassId === c.id
                            ? 'bg-teal-700 text-white'
                            : 'hover:bg-teal-800 hover:text-white'
                    }`}
                >
                    {c.name}
                </button>
            ))}
            {/* Not a class: lists archived students from every class */}
            <button
                onClick={onSelectArchivedView}
                className={`px-4 py-2 rounded-md cursor-pointer ${
                    isArchivedViewSelected
                        ? 'bg-teal-700 text-white'
                        : 'hover:bg-teal-800 hover:text-white'
                }`}
            >
                Archived
            </button>
        </div>
    );
}

export default Tabs;
