/**
 * Gets the canvas content as a JPEG Blob.
 * @param {import("./EYE").EYE} eyeInstance - The EYE custom element instance.
 * @returns {Promise<Blob>} A promise that resolves with the image Blob.
 */
export async function getJpeg(eyeInstance) {
  // Convert canvas to Blob and return it
  const image_data = await new Promise(resolve => {
    eyeInstance.scratch_canvas.toBlob((blob) => {
      resolve(blob);
    }, "image/jpeg", 0.8);
  });
  return image_data;
}

/**
 * Gets the canvas content as a PNG data URL.
 * @param {import("./EYE").EYE} eyeInstance - The EYE custom element instance.
 * @returns {Promise<string>} A promise that resolves with the image data URL.
 */
export async function getImageData(eyeInstance) {
  const image_data = await eyeInstance.scratch_canvas.toDataURL('image/png');
  return image_data;
}

/**
 * Takes a picture and dispatches a 'NEW PICTURE' event.
 * @param {import("./EYE").EYE} eyeInstance - The EYE custom element instance.
 */
export async function takePicture(eyeInstance) {
  const img = await getJpeg(eyeInstance);
  eyeInstance.dispatchEvent(new CustomEvent('NEW PICTURE', {
    detail: img
  }));
}
