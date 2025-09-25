import {
  getUserMedia
} from "./video.js";
import {
  takePicture
} from "./image.js";

/**
 * Creates the main menu container.
 * @param {import("./EYE").EYE} eyeInstance - The EYE custom element instance.
 */
export function createMenu(eyeInstance) {
  const menu_container = document.createElement('details');
  const summary = document.createElement('summary');
  menu_container.appendChild(summary);
  eyeInstance.menu = document.createElement('section');
  menu_container.appendChild(eyeInstance.menu);
  eyeInstance.appendChild(menu_container);
}

/**
 * Creates the flip image button.
 * @param {import("./EYE").EYE} eyeInstance - The EYE custom element instance.
 */
export function createFlipButton(eyeInstance) {
  const flip_button_label = document.createElement('label');
  flip_button_label.innerText = 'Flip Image';
  const flip_checkbox = document.createElement('input');
  flip_checkbox.setAttribute('type', 'checkbox');
  flip_button_label.appendChild(flip_checkbox);
  eyeInstance.menu.appendChild(flip_button_label);
  flip_checkbox.addEventListener('click', (e) => {
    eyeInstance.flipped = e.target.checked;
  });
}

/**
 * Creates the contrast slider.
 * @param {import("./EYE").EYE} eyeInstance - The EYE custom element instance.
 */
export function createContrastSlider(eyeInstance) {
  const contrast_slider_label = document.createElement('label');
  contrast_slider_label.innerText = 'Contrast';
  const contrast_slider = document.createElement('input');
  contrast_slider.setAttribute('type', 'range');
  contrast_slider.setAttribute('min', 0);
  contrast_slider.setAttribute('max', 300);
  contrast_slider.value = 100;
  contrast_slider_label.appendChild(contrast_slider);
  eyeInstance.menu.appendChild(contrast_slider_label);
  contrast_slider.addEventListener('change', (e) => {
    eyeInstance.contrast = e.target.value;
  });

  eyeInstance.contrast_slider = contrast_slider;
}

/**
 * Creates the saturation slider.
 * @param {import("./EYE").EYE} eyeInstance - The EYE custom element instance.
 */
export function createSaturationSlider(eyeInstance) {
  const saturation_slider_label = document.createElement('label');
  saturation_slider_label.innerText = 'Saturate';
  const saturation_slider = document.createElement('input');
  saturation_slider.setAttribute('type', 'range');
  saturation_slider.setAttribute('min', 0);
  saturation_slider.setAttribute('max', 300);
  saturation_slider.value = 100;
  saturation_slider_label.appendChild(saturation_slider);
  eyeInstance.menu.appendChild(saturation_slider_label);
  saturation_slider.addEventListener('change', (e) => {
    eyeInstance.saturation = e.target.value;
  });
  eyeInstance.saturation_slider = saturation_slider;
}

/**
 * Creates the brightness slider.
 * @param {import("./EYE").EYE} eyeInstance - The EYE custom element instance.
 */
export function createBrightnessSlider(eyeInstance) {
  const Brightness_slider_label = document.createElement('label');
  Brightness_slider_label.innerText = 'Brightness';
  const Brightness_slider = document.createElement('input');
  Brightness_slider.setAttribute('type', 'range');
  Brightness_slider.setAttribute('min', 0);
  Brightness_slider.setAttribute('max', 300);
  Brightness_slider.value = 100;
  Brightness_slider_label.appendChild(Brightness_slider);
  eyeInstance.menu.appendChild(Brightness_slider_label);
  Brightness_slider.addEventListener('change', (e) => {
    eyeInstance.brightness = e.target.value;
  });

  eyeInstance.brightness_slider = Brightness_slider
}

/**
 * Creates the hue slider.
 * @param {import("./EYE").EYE} eyeInstance - The EYE custom element instance.
 */
export function createhueSlider(eyeInstance) {
  const hue_slider_label = document.createElement('label');
  hue_slider_label.innerText = 'hue';
  const hue_slider = document.createElement('input');
  hue_slider.setAttribute('type', 'range');
  hue_slider.setAttribute('min', 0);
  hue_slider.setAttribute('max', 360);
  hue_slider.value = 180;
  hue_slider_label.appendChild(hue_slider);
  eyeInstance.menu.appendChild(hue_slider_label);
  hue_slider.addEventListener('change', (e) => {
    eyeInstance.hue = e.target.value;
  });

  eyeInstance.hue_slider = hue_slider
}

/**
 * Creates the reset button.
 * @param {import("./EYE").EYE} eyeInstance - The EYE custom element instance.
 */
export function createResetButton(eyeInstance) {
  const reset_button_label = document.createElement('label');
  const reset_button = document.createElement('button');
  reset_button.innerText = 'Reset'
  reset_button_label.appendChild(reset_button);
  eyeInstance.menu.appendChild(reset_button_label);
  reset_button.addEventListener('click', (e) => {
    eyeInstance.contrast_slider.value = 100;
    eyeInstance.brightness_slider.value = 100;
    eyeInstance.saturation_slider.value = 100;
    eyeInstance.hue_slider.value = 0;

    eyeInstance.contrast = 100;
    eyeInstance.saturation = 100;
    eyeInstance.brightness = 100;
    eyeInstance.hue = 0;

  });
}

/**
 * Creates the selected device dropdown.
 * @param {import("./EYE").EYE} eyeInstance - The EYE custom element instance.
 */
export async function createSelectedDeviceDropdown(eyeInstance) {
  const connected_devices = [...await navigator.mediaDevices.enumerateDevices()].filter(d => d.kind === 'videoinput');
  const selection_label = document.createElement('label');
  const video_inputs = document.createElement('select');
  for (let device_index in connected_devices) {
    const device = connected_devices[device_index];
    const option = document.createElement('option');
    option.setAttribute('value', device.deviceId);
    option.innerText = device.label || `Camera ${parseInt(device_index) + 1}`;
    video_inputs.appendChild(option);
  }
  video_inputs.addEventListener('change', (e) => {
    eyeInstance.selected_device = e.target.value;
    console.log(eyeInstance.selected_device);
    getUserMedia(eyeInstance);
  });
  selection_label.appendChild(video_inputs);
  eyeInstance.menu.appendChild(selection_label);
}

/**
 * Creates the take picture button.
 * @param {import("./EYE").EYE} eyeInstance - The EYE custom element instance.
 */
export function createTakePictureButton(eyeInstance) {
  const take_picture_label = document.createElement('label');
  eyeInstance.take_picture_button = document.createElement('button');
  eyeInstance.take_picture_button.classList.add('take-picture-button');
  eyeInstance.take_picture_button.innerText = 'Take Picture';
  eyeInstance.take_picture_button.addEventListener('click', (e) => {
    e.preventDefault();
    takePicture(eyeInstance);
  });

  take_picture_label.appendChild(eyeInstance.take_picture_button);
  eyeInstance.menu.appendChild(take_picture_label);
}
