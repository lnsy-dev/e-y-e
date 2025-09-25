import {
  createMenu,
  createFlipButton,
  createContrastSlider,
  createSaturationSlider,
  createBrightnessSlider,
  createhueSlider,
  createResetButton,
  createSelectedDeviceDropdown,
  createTakePictureButton
} from './ui.js';
import {
  getUserMedia,
  beginVideoPoll,
  pauseVideoPoll,
  stopVideoStream,
  pollVideo
} from './video.js';
import {
  takePicture,
  getJpeg,
  getImageData
} from './image.js';
import {
  drawLine
} from './canvas.js';
import { QRCodeReader } from './qr-code-reader.js';

/**
 * @class EYE
 * @extends {HTMLElement}
 * @classdesc The EYE custom element for video manipulation.
 */
export class EYE extends HTMLElement {
  video_polling = false;
  flipped = false;
  eye_size = 768;
  contrast = 100;
  saturation = 100;
  brightness = 100;
  hue = 0;
  selected_device = null;
  qrCodeReader = null;

  /**
   * Renders the initial 'Connect' button.
   * @memberof EYE
   */
  render() {
    const initialize_button = document.createElement('button');
    initialize_button.classList.add('initialize-button')
    initialize_button.innerText = 'Connect';
    initialize_button.addEventListener('click', (e) => {
      this.openEYE();
    });
    this.appendChild(initialize_button);
  }

  /**
   * Draws a line on the canvas.
   * @param {number} startX
   * @param {number} startY
   * @param {number} endX
   * @param {number} endY
   * @param {number} [lineWidth=1]
   * @param {string} [strokeStyle='red']
   * @memberof EYE
   */
  drawLine(startX, startY, endX, endY, lineWidth = 1, strokeStyle = 'red') {
    drawLine(this, startX, startY, endX, endY, lineWidth, strokeStyle);
  }

  /**
   * Gets the canvas content as a JPEG Blob.
   * @returns {Promise<Blob>}
   * @memberof EYE
   */
  getJpeg() {
    return getJpeg(this);
  }

  /**
   * Gets the canvas content as a PNG data URL.
   * @returns {Promise<string>}
   * @memberof EYE
   */
  getImageData() {
    return getImageData(this);
  }

  /**
   * Takes a picture and dispatches a 'NEW PICTURE' event.
   * @memberof EYE
   */
  takePicture() {
    return takePicture(this);
  }

  /**
   * Gets user media and attaches it to the video element.
   * @memberof EYE
   */
  getUserMedia() {
    return getUserMedia(this);
  }

  /**
   * Starts polling the video stream.
   * @memberof EYE
   */
  beginVideoPoll() {
    return beginVideoPoll(this);
  }

  /**
   * Pauses the video polling.
   * @memberof EYE
   */
  pauseVideoPoll() {
    return pauseVideoPoll(this);
  }

  /**
   * Polls the video for a new frame.
   * @memberof EYE
   */
  pollVideo() {
    return pollVideo(this);
  }

  /**
   * Stops the video stream.
   * @memberof EYE
   */
  stopVideoStream() {
    return stopVideoStream(this);
  }

  /**
   * Initializes the EYE component, sets up UI and video.
   * @memberof EYE
   */
  openEYE() {
    this.innerHTML = ``;
    this.scratch_canvas = document.createElement('canvas');
    this.scratch_canvas.addEventListener('click', (e) => {
      if (this.video_polling) {
        this.pauseVideoPoll();
      } else {
        this.beginVideoPoll();
      }
    });
    const widthAttr = this.getAttribute('width');
    const heightAttr = this.getAttribute('height');
    let canvasWidth = this.offsetWidth;
    let canvasHeight = this.offsetHeight;

    if (widthAttr && !heightAttr) {
      canvasHeight = canvasWidth;
    } else if (!widthAttr && heightAttr) {
      canvasWidth = canvasHeight;
    } else if (!widthAttr && !heightAttr) {
      canvasWidth = this.eye_size;
      canvasHeight = this.eye_size;
    }

    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;

    this.scratch_canvas.width = this.canvasWidth;
    this.scratch_canvas.height = this.canvasHeight;
    this.scratch_canvas_context = this.scratch_canvas.getContext('2d', {
      preserveDrawingBuffer: true
    });

    this.final_canvas = document.createElement('canvas');
    this.final_canvas.width = this.canvasWidth;
    this.final_canvas.height = this.canvasHeight;
    this.final_canvas_context = this.final_canvas.getContext('2d', {
      preserveDrawingBuffer: true
    });
    this.appendChild(this.final_canvas);

    this.video = document.createElement('video');
    this.video.onloadedmetadata = (e) => {
      this.video.play();
    };
    this.getUserMedia();

    createMenu(this);
    createFlipButton(this);
    createContrastSlider(this);
    createSaturationSlider(this);
    createBrightnessSlider(this);
    createhueSlider(this);
    createResetButton(this);
    createSelectedDeviceDropdown(this);
    createTakePictureButton(this);

    const details = [...document.querySelectorAll('details')];
    document.addEventListener('click', function(e) {
      if (!details.some(f => f.contains(e.target))) {
        details.forEach(f => f.removeAttribute('open'));
      } else {
        details.forEach(f => !f.contains(e.target) ? f.removeAttribute('open') : '');
      }
    });
  }

  /**
   * Initializes the component.
   * @memberof EYE
   */
  async initialize() {
    this.openEYE();
  }

  /**
   * Called when the element is added to the document.
   * @memberof EYE
   */
  connectedCallback() {
    this.render();
  }

  /**
   * Called when the element is removed from the document.
   * @memberof EYE
   */
  disconnectedCallback() {
    this.pauseVideoPoll();
    this.stopVideoStream();
  }

  /**
   * Observed attributes for the custom element.
   * @returns {Array}
   * @static
   * @memberof EYE
   */
  static get observedAttributes() {
    return ['qr-code-reader', 'width', 'height'];
  }

  /**
   * Called when an observed attribute changes.
   * @param {string} name
   * @param {any} old_value
   * @param {any} new_value
   * @memberof EYE
   */
  attributeChangedCallback(name, old_value, new_value) {
    if (name === 'qr-code-reader') {
      if (new_value === 'true') {
        if (!this.qrCodeReader) {
          this.qrCodeReader = new QRCodeReader(this);
        }
      } else {
        if (this.qrCodeReader) {
          this.qrCodeReader.destroy();
          this.qrCodeReader = null;
        }
      }
    }
    if (name === 'width' || name === 'height') {
      if (new_value) {
        this.style[name] = isNaN(new_value) ? new_value : `${new_value}px`;
      }
    }
  }
}

customElements.define('e-y-e', EYE);
