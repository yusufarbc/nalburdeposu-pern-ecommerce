/**
 * Creates a new HTMLImageElement from a URL
 */
export const createImage = (url) =>
    new Promise((resolve, reject) => {
        const image = new Image()
        image.addEventListener('load', () => resolve(image))
        image.addEventListener('error', (error) => reject(error))
        image.setAttribute('crossOrigin', 'anonymous')
        image.src = url
    })

/**
 * Returns the new bounding area of a rotated rectangle.
 */
export function getRotatedRect(image, rotation) {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const { width, height } = image

    const angle = (rotation * Math.PI) / 180
    const absCos = Math.abs(Math.cos(angle))
    const absSin = Math.abs(Math.sin(angle))

    canvas.width = width * absCos + height * absSin
    canvas.height = width * absSin + height * absCos

    return {
        width: canvas.width,
        height: canvas.height,
        ctx,
        canvas,
    }
}

/**
 * Encapsulates the logic to extract a cropped image from the source image.
 * Returns a blob of the cropped image in WebP format.
 * 
 * @param {string} imageSrc - The source image URL
 * @param {object} pixelCrop - The pixel crop area { x, y, width, height }
 * @param {number} rotation - Rotation in degrees (default 0)
 * @param {boolean} flip - Horizontal flip (default false)
 * @param {object} options - resize options { width, height }
 */
export default async function getCroppedImg(
    imageSrc,
    pixelCrop,
    rotation = 0,
    flip = { horizontal: false, vertical: false },
    options = { width: 1000, height: 1000 }
) {
    const image = await createImage(imageSrc)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    if (!ctx) {
        return null
    }

    const rotRad = (rotation * Math.PI) / 180

    // calculate bounding box of the rotated image
    const { width: bBoxWidth, height: bBoxHeight } = getRotatedRect(image, rotation)

    // set canvas size to match the bounding box
    canvas.width = bBoxWidth
    canvas.height = bBoxHeight

    // translate canvas context to a central location to allow rotating and flipping around the center
    ctx.translate(bBoxWidth / 2, bBoxHeight / 2)
    ctx.rotate(rotRad)
    ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1)
    ctx.translate(-image.width / 2, -image.height / 2)

    // draw rotated image
    ctx.drawImage(image, 0, 0)

    // croppedAreaPixels values are bounding box relative
    // extract the cropped image using these values
    const data = ctx.getImageData(
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height
    )

    // set canvas width to final desired crop size - this will clear existing context
    // Here we use the target size (e.g. 1000x1000) for the final output
    // But wait, the pixelCrop might be smaller if we zoomed in. 
    // We should first draw the crop to a temporary canvas, then resize it?
    // Actually, standard practice is: creates a canvas of the crop size, puts the data there.
    // Then if we need to resize to specifically 1000px, we do it after or via another canvas.

    // Let's create a canvas for the crop result first
    canvas.width = pixelCrop.width
    canvas.height = pixelCrop.height

    // paste generated rotate image filtering out the empty regions
    ctx.putImageData(data, 0, 0)

    // If we want to enforce a specific output size (e.g. 1000x1000)
    if (options.width && options.height) {
        const resizedCanvas = document.createElement('canvas');
        resizedCanvas.width = options.width;
        resizedCanvas.height = options.height;
        const resizedCtx = resizedCanvas.getContext('2d');

        // Draw white background for transparency safety
        resizedCtx.fillStyle = '#FFFFFF';
        resizedCtx.fillRect(0, 0, options.width, options.height);

        // Draw the cropped image resized
        resizedCtx.drawImage(canvas, 0, 0, options.width, options.height);

        return new Promise((resolve, reject) => {
            resizedCanvas.toBlob((file) => {
                if (file) resolve(file)
                else reject(new Error('Canvas is empty'))
            }, 'image/webp', 0.8) // 80% quality WebP
        })
    }

    // Fallback if no resize options provided
    return new Promise((resolve, reject) => {
        canvas.toBlob((file) => {
            if (file) resolve(file)
            else reject(new Error('Canvas is empty'))
        }, 'image/webp', 0.8)
    })
}
