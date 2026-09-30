// students.name is a single column. The edit modal shows first/last separately,
// so we split on the first run of whitespace when reading and join with one space when saving.

export function getInitials(name: string) {
    return name
        .trim()
        .split(/\s+/)
        .map((word) => word[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();
}

export function getAvatarColor(studentId: number) {
    const avatarColors = ['#F8E1DB', '#F8ECD4', '#E2EFE2', '#DEEAF3'];
    return avatarColors[studentId % avatarColors.length];
}

export function splitName(fullName: string) {
    const trimmedName = fullName.trim();
    const firstSpaceIndex = trimmedName.search(/\s/);
    if (firstSpaceIndex === -1) return { firstName: trimmedName, lastName: '' };
    return {
        firstName: trimmedName.slice(0, firstSpaceIndex),
        lastName: trimmedName.slice(firstSpaceIndex).trim(),
    };
}

export function joinName(firstName: string, lastName: string) {
    return `${firstName.trim()} ${lastName.trim()}`.trim();
}
