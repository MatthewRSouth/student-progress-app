import useRestoreStudent from '../../hooks/useRestoreStudent';
import { getInitials, getAvatarColor } from '../../utils/studentNames';
//types
import { type Student, type Cls } from '../../types';

type ArchivedStudentListProps = {
    archivedStudents: Student[];
    classes: Cls[];
    isAdmin: boolean;
    refetchStudents: () => void;
};

function ArchivedStudentList({
    archivedStudents,
    classes,
    isAdmin,
    refetchStudents,
}: ArchivedStudentListProps) {
    const { restoreStudentError, restoringStudentId, handleRestoreStudent } =
        useRestoreStudent(refetchStudents);

    return (
        <div className="bg-white w-[95vw] max-w-[830px] rounded-lg mt-4 p-6">
            <h2 className="text-xl font-bold text-[#2E2A24]">Archived students</h2>
            <p className="text-sm text-[#5C5343] mb-4">
                Hidden from the dashboard. Their ratings and notes are kept.
            </p>
            {restoreStudentError && (
                <p className="text-red-600 text-sm mb-2">{restoreStudentError}</p>
            )}

            {archivedStudents.length === 0 ? (
                <p className="text-sm text-[#A39A8C] py-2">No archived students.</p>
            ) : (
                <ul>
                    {archivedStudents.map((archivedStudent) => {
                        const formerClassName =
                            classes.find((cls) => cls.id === archivedStudent.class_id)
                                ?.name ?? '';
                        return (
                            <li
                                key={archivedStudent.id}
                                className="flex items-center gap-4 border-t border-[#F2EDE4] py-3"
                            >
                                <div
                                    className="rounded-full w-10 h-10 flex items-center justify-center text-white shrink-0"
                                    style={{
                                        backgroundColor: getAvatarColor(
                                            archivedStudent.id,
                                        ),
                                    }}
                                >
                                    {getInitials(archivedStudent.name)}
                                </div>
                                <div className="flex-1">
                                    <p className="text-[#2E2A24]">
                                        {archivedStudent.name}
                                    </p>
                                    <p className="text-xs text-[#8C8377]">
                                        Formerly in {formerClassName}
                                    </p>
                                </div>
                                {isAdmin && (
                                    <button
                                        onClick={() =>
                                            handleRestoreStudent(archivedStudent.id)
                                        }
                                        disabled={
                                            restoringStudentId === archivedStudent.id
                                        }
                                        className="border border-[#E6DDCE] bg-[#FBF8F2] rounded-lg px-3 py-2 text-sm font-semibold cursor-pointer hover:bg-[#F4EEE3] disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Restore
                                    </button>
                                )}
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}

export default ArchivedStudentList;
