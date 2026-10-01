import { useState } from 'react';
import { getInitials, getAvatarColor } from '../utils/studentNames';

type AvatarSize = 'small' | 'large';

type AvatarProps = {
    name: string;
    // The circle color is picked from the student's id
    studentId: number;
    imageUrl?: string | null;
    size: AvatarSize;
    className?: string;
};

const SIZE_CLASSES: Record<AvatarSize, string> = {
    small: 'w-10 h-10 text-white',
    large: 'w-14 h-14 font-semibold text-[#5C5343]',
};

// A student's photo, or their initials in a colored circle when there is no photo or it fails to load
function Avatar({ name, studentId, imageUrl, size, className = '' }: AvatarProps) {
    // Remembering which URL failed (not just "failed") lets a fresh URL try again
    const [failedImageUrl, setFailedImageUrl] = useState<string | null>(null);
    const showPhoto = Boolean(imageUrl) && imageUrl !== failedImageUrl;

    return (
        <div
            className={`rounded-full overflow-hidden flex items-center justify-center shrink-0 ${SIZE_CLASSES[size]} ${className}`}
            style={{ backgroundColor: getAvatarColor(studentId) }}
        >
            {showPhoto && imageUrl ? (
                <img
                    src={imageUrl}
                    alt=""
                    className="w-full h-full object-cover"
                    onError={() => setFailedImageUrl(imageUrl)}
                />
            ) : (
                getInitials(name)
            )}
        </div>
    );
}

export default Avatar;
