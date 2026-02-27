import imageCompression from 'browser-image-compression';

export async function compressToWebP(file: File): Promise<File> {
    const options = {
        maxSizeMB: 0.5, // 500 Ko max
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        fileType: 'image/webp',
        initialQuality: 0.85
    };

    try {
        const compressedBlob = await imageCompression(file, options);
        return new File([compressedBlob], `${file.name.split('.')[0]}.webp`, {
            type: 'image/webp',
        });
    } catch (error) {
        console.error("Erreur de compression d'image:", error);
        throw error;
    }
}
