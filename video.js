/**
 * Gets user media and attaches it to the video element.
 * @param {import("./EYE").EYE} eyeInstance - The EYE custom element instance.
 */
export async function getUserMedia(eyeInstance) {
  stopVideoStream(eyeInstance)
  const constraints = {
    video: {
      deviceId: eyeInstance.selected_device,
      width: eyeInstance.canvasWidth,
      height: eyeInstance.canvasHeight
    }
  };
  try {
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    eyeInstance.video.srcObject = stream;
    eyeInstance.video.volume = 0;
    eyeInstance.video.play();
    beginVideoPoll(eyeInstance);
  } catch (error) {
    console.error('Error accessing user media:', error);
  }
}

/**
 * Starts polling the video stream and drawing it to the canvas.
 * @param {import("./EYE").EYE} eyeInstance - The EYE custom element instance.
 */
export function beginVideoPoll(eyeInstance) {
  eyeInstance.video_polling = true;
  eyeInstance.video_poll = setInterval(() => pollVideo(eyeInstance), 250);
}

/**
 * Pauses the video polling.
 * @param {import("./EYE").EYE} eyeInstance - The EYE custom element instance.
 */
export function pauseVideoPoll(eyeInstance) {
  eyeInstance.video_polling = false;
  clearInterval(eyeInstance.video_poll);
}

/**
 * Polls the video for a new frame and draws it on the canvas.
 * @param {import("./EYE").EYE} eyeInstance - The EYE custom element instance.
 */
export async function pollVideo(eyeInstance) {
  const s_ctx = eyeInstance.scratch_canvas_context;
  const f_ctx = eyeInstance.final_canvas_context;
  const width = eyeInstance.canvasWidth;
  const height = eyeInstance.canvasHeight;

  // Reset transformations from previous frame
  s_ctx.setTransform(1, 0, 0, 1, 0, 0);

  // Apply flip for this frame if needed
  if (eyeInstance.flipped) {
    s_ctx.translate(width, 0);
    s_ctx.scale(-1, 1);
  }

  // Apply filter
  s_ctx.filter = `saturate(${eyeInstance.saturation}%) brightness(${eyeInstance.brightness}%) contrast(${eyeInstance.contrast}%) hue-rotate(${eyeInstance.hue}deg)`;

  await s_ctx.drawImage(eyeInstance.video, 0, 0, width, height);

  const img_data = await s_ctx.getImageData(0, 0, width, height);

  f_ctx.putImageData(img_data, 0, 0);

  eyeInstance.dispatchEvent(new CustomEvent("IMAGE DRAWN", {
    detail: img_data
  }));
}

/**
 * Stops the video stream tracks.
 * @param {import("./EYE").EYE} eyeInstance - The EYE custom element instance.
 */
export function stopVideoStream(eyeInstance) {
  if (eyeInstance.video && eyeInstance.video.srcObject) {
    let tracks = eyeInstance.video.srcObject.getTracks();
    tracks.forEach(track => track.stop());
    eyeInstance.video.srcObject = null;
  }
}
