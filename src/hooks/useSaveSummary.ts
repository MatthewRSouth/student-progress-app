import { useState, useEffect, useRef } from 'react';
import supabase from '../services/supabase';

const AUTOSAVE_DELAY_MS = 800;

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

async function upsertSummary(studentId: number, userId: string, summary: string) {
    return supabase.from('student_summaries').upsert(
        {
            student_id: studentId,
            summary,
            updated_by: userId,
            updated_at: new Date().toISOString(),
        },
        { onConflict: 'student_id' },
    );
}

function useSaveSummary(studentId: number, userId: string, initialSummary: string) {
    const [summaryText, setSummaryText] = useState(initialSummary);
    const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
    const unsavedTextRef = useRef<string | null>(null);
    const autosaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    async function saveUnsavedText() {
        const textToSave = unsavedTextRef.current;
        if (textToSave === null) return;
        unsavedTextRef.current = null;

        const { error } = await upsertSummary(studentId, userId, textToSave);
        if (error) {
            console.error(error);
            setSaveStatus('error');
            return;
        }
        // Only report "saved" if nothing new was typed while this request was in flight
        if (unsavedTextRef.current === null) setSaveStatus('saved');
    }

    function handleSummaryChange(newText: string) {
        setSummaryText(newText);
        setSaveStatus('saving');
        unsavedTextRef.current = newText;
        if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current);
        autosaveTimerRef.current = setTimeout(saveUnsavedText, AUTOSAVE_DELAY_MS);
    }

    // Leaving the page mid-debounce: save what's pending instead of dropping it
    useEffect(() => {
        return () => {
            if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current);
            if (unsavedTextRef.current !== null) {
                upsertSummary(studentId, userId, unsavedTextRef.current);
                unsavedTextRef.current = null;
            }
        };
    }, [studentId, userId]);

    return { summaryText, handleSummaryChange, saveStatus };
}

export default useSaveSummary;
