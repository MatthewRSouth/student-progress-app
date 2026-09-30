import { LEVELS, MODALLEVELS } from '../constants/levels';
import { type Rating } from '../types';

type StatusPillProps = {
    level: Rating['level'];
};

function StatusPill({ level }: StatusPillProps) {
    return (
        <span
            className={`${MODALLEVELS[level].color} inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold text-[#2E2A24] whitespace-nowrap`}
        >
            <span className={`${LEVELS[level].color} h-2 w-2 rounded-full`} />
            {LEVELS[level].label}
        </span>
    );
}

export default StatusPill;
