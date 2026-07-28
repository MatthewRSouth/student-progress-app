import { type Term } from '../../types';
type TermProps = {
    effectiveTermId: number;
    selectedTermId: number | null;
    setSelectedTermId: (termId: number) => void;
    terms: Term[];
};

function Terms({ effectiveTermId, setSelectedTermId, terms }: TermProps) {
    return (
        <select
            value={effectiveTermId}
            onChange={(e) => setSelectedTermId(Number(e.target.value))}
        >
            <option value="">Select a Term</option>
            {terms.map((term) => (
                <option key={term.id} value={term.id}>
                    {term.term}
                </option>
            ))}
        </select>
    );
}

export default Terms;
