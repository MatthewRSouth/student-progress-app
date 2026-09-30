import { MODALLEVELS } from '../../constants/levels';
import { getInitials, getAvatarColor } from '../../utils/studentNames';
import { type Student } from '../../types';

type ProfileHeaderProps = {
    student: Student;
    className: string;
    currentTermAverage: number | null;
    isAdmin: boolean;
    onEdit: () => void;
    onRemove: () => void;
};

function ProfileHeader({
    student,
    className,
    currentTermAverage,
    isAdmin,
    onEdit,
    onRemove,
}: ProfileHeaderProps) {
    const averageLevel =
        currentTermAverage === null
            ? null
            : (Math.min(4, Math.max(1, Math.round(currentTermAverage))) as 1 | 2 | 3 | 4);

    return (
        <div className="bg-white rounded-2xl border border-[#EFEAE1] p-6 flex items-center justify-between break-inside-avoid">
            <div className="flex items-center gap-4">
                <div
                    className="rounded-xl w-14 h-14 flex items-center justify-center font-semibold text-[#5C5343] shrink-0"
                    style={{ backgroundColor: getAvatarColor(student.id) }}
                >
                    {getInitials(student.name)}
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-[#2E2A24]">{student.name}</h1>
                    <p className="text-sm text-[#5C5343]">{className}</p>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <span
                    className={`${averageLevel ? MODALLEVELS[averageLevel].color : 'bg-[#EFE7D8]'} rounded-lg px-3 py-2 text-sm font-semibold text-[#2E2A24]`}
                >
                    {currentTermAverage === null
                        ? 'No scores this term'
                        : `Avg ${currentTermAverage.toFixed(1)}`}
                </span>
                {isAdmin && (
                    <>
                        <button
                            onClick={onEdit}
                            className="print:hidden border border-[#E6DDCE] bg-[#FBF8F2] rounded-lg px-3 py-2 text-sm font-semibold cursor-pointer hover:bg-[#F4EEE3]"
                        >
                            Edit
                        </button>
                        <button
                            onClick={onRemove}
                            className="print:hidden border border-[#F8E1DB] bg-[#F8E1DB] text-[#B5402F] rounded-lg px-3 py-2 text-sm font-semibold cursor-pointer hover:opacity-80"
                        >
                            Remove
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

export default ProfileHeader;
