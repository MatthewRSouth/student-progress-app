import { useState, useEffect } from 'react';
import supabase from '../services/supabase';
import {
    AVATAR_BUCKET,
    AVATAR_SIGNED_URL_EXPIRY_SECONDS,
    AVATAR_URL_REFRESH_INTERVAL_MS,
} from '../constants/avatars';
import { type Student } from '../types';

// The photo bucket is private, so each photo needs a short-lived signed URL.
// Returns a map of student id -> signed URL for the given students, signed in one batched call.
// Students without a photo are left out of the map (they show initials).
function useAvatarUrls(students: Student[]) {
    const [avatarUrls, setAvatarUrls] = useState<Record<number, string>>({});

    // A string key, so a refetch that returns the same photos does not sign them again
    const avatarPathsKey = students
        .filter((student) => student.avatar_path)
        .map((student) => `${student.id}:${student.avatar_path}`)
        .join('|');

    useEffect(() => {
        let isCurrent = true;
        let lastSignedAt = 0;

        async function signAvatarUrls() {
            if (avatarPathsKey === '') {
                setAvatarUrls({});
                return;
            }
            const studentIdByAvatarPath: Record<string, number> = {};
            avatarPathsKey.split('|').forEach((keyEntry) => {
                const separatorIndex = keyEntry.indexOf(':');
                const avatarPath = keyEntry.slice(separatorIndex + 1);
                studentIdByAvatarPath[avatarPath] = Number(
                    keyEntry.slice(0, separatorIndex),
                );
            });

            try {
                lastSignedAt = Date.now();
                const { data, error } = await supabase.storage
                    .from(AVATAR_BUCKET)
                    .createSignedUrls(
                        Object.keys(studentIdByAvatarPath),
                        AVATAR_SIGNED_URL_EXPIRY_SECONDS,
                    );
                if (error) throw error;
                if (!isCurrent) return;

                const signedUrlByStudentId: Record<number, string> = {};
                data.forEach((signedEntry) => {
                    if (signedEntry.path && signedEntry.signedUrl) {
                        signedUrlByStudentId[
                            studentIdByAvatarPath[signedEntry.path]
                        ] = signedEntry.signedUrl;
                    }
                });
                setAvatarUrls(signedUrlByStudentId);
            } catch (err) {
                // Photos are optional: on failure the avatars simply show initials
                console.error(err);
            }
        }

        signAvatarUrls();
        const refreshInterval = setInterval(
            signAvatarUrls,
            AVATAR_URL_REFRESH_INTERVAL_MS,
        );
        // Browsers slow timers in background tabs, so also refresh when the tab is shown again
        function handleVisibilityChange() {
            if (
                document.visibilityState === 'visible' &&
                Date.now() - lastSignedAt >= AVATAR_URL_REFRESH_INTERVAL_MS
            ) {
                signAvatarUrls();
            }
        }
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            isCurrent = false;
            clearInterval(refreshInterval);
            document.removeEventListener(
                'visibilitychange',
                handleVisibilityChange,
            );
        };
    }, [avatarPathsKey]);

    return avatarUrls;
}

export default useAvatarUrls;
