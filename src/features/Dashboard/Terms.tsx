import { type Term } from '../../types';
type TermProps = {
    selectedTermId: number | null;
    setSelectedTermId: (termId: number) => void;
    terms: Term[];
};

function Terms({ selectedTermId, setSelectedTermId, terms }: TermProps) {
    return (
        <select
            value={selectedTermId ?? ''}
            onChange={(e) => setSelectedTermId(Number(e.target.value))}
        >
            <option value="">Select a term</option>
            {terms.map((term) => (
                <option key={term.id} value={term.id}>
                    {term.term}
                </option>
            ))}
        </select>
    );
}

export default Terms;
