import { type Class } from '../../types';
type TabProps = {
    selectedClassId: number | null;
    classes: Class[];
    onSelectClass: (classId: number) => void;
};

function Tabs({ selectedClassId, onSelectClass, classes }: TabProps) {
    return (
        <div className="flex justify-center my-4 gap-2">
            {classes.map((c) => (
                <button
                    key={c.id}
                    onClick={() => onSelectClass(c.id)}
                    className={`px-4 py-2 rounded-md cursor-pointer ${
                        selectedClassId === c.id
                            ? 'bg-black text-white'
                            : 'bg-gray-200'
                    }`}
                >
                    {c.name}
                </button>
            ))}
        </div>
    );
}

export default Tabs;
