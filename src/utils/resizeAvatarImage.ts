import {
    ACCEPTED_AVATAR_FILE_TYPES,
    MAX_AVATAR_FILE_SIZE_BYTES,
    AVATAR_OUTPUT_SIZE_PX,
    AVATAR_OUTPUT_JPEG_QUALITY,
} from '../constants/avatars';

type ResizeAvatarResult =
    | { resizedImage: Blob; errorMessage: null }
    | { resizedImage: null; errorMessage: string };

const UNSUPPORTED_PHOTO_MESSAGE =
    'That photo could not be read. Please use a JPEG or PNG photo.';

// Center-crops the chosen photo to a square, scales it down and re-encodes it as a JPEG.
// Only the pixels are drawn to the canvas, so the result carries none of the original's
// EXIF metadata (including GPS location).
export async function resizeAvatarImage(file: File): Promise<ResizeAvatarResult> {
    if (!ACCEPTED_AVATAR_FILE_TYPES.includes(file.type)) {
        return { resizedImage: null, errorMessage: UNSUPPORTED_PHOTO_MESSAGE };
    }
    if (file.size > MAX_AVATAR_FILE_SIZE_BYTES) {
        return {
            resizedImage: null,
            errorMessage: 'That photo is over 10 MB. Please choose a smaller one.',
        };
    }

    let decodedImage: ImageBitmap;
    try {
        // Applies the photo's EXIF rotation, so phone photos come out upright
        decodedImage = await createImageBitmap(file);
    } catch (err) {
        console.error(err);
        return { resizedImage: null, errorMessage: UNSUPPORTED_PHOTO_MESSAGE };
    }

    const canvas = document.createElement('canvas');
    canvas.width = AVATAR_OUTPUT_SIZE_PX;
    canvas.height = AVATAR_OUTPUT_SIZE_PX;
    const context = canvas.getContext('2d');
    if (!context) {
        decodedImage.close();
        return { resizedImage: null, errorMessage: UNSUPPORTED_PHOTO_MESSAGE };
    }

    const cropSide = Math.min(decodedImage.width, decodedImage.height);
    const cropLeft = (decodedImage.width - cropSide) / 2;
    const cropTop = (decodedImage.height - cropSide) / 2;

    // JPEG has no transparency: without this a transparent PNG would get a black background
    context.fillStyle = '#fff';
    context.fillRect(0, 0, AVATAR_OUTPUT_SIZE_PX, AVATAR_OUTPUT_SIZE_PX);
    context.imageSmoothingQuality = 'high';
    context.drawImage(
        decodedImage,
        cropLeft,
        cropTop,
        cropSide,
        cropSide,
        0,
        0,
        AVATAR_OUTPUT_SIZE_PX,
        AVATAR_OUTPUT_SIZE_PX,
    );
    decodedImage.close();

    const resizedImage = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, 'image/jpeg', AVATAR_OUTPUT_JPEG_QUALITY),
    );
    if (!resizedImage) {
        return { resizedImage: null, errorMessage: UNSUPPORTED_PHOTO_MESSAGE };
    }
    return { resizedImage, errorMessage: null };
}
