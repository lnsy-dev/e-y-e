
class EYE extends HTMLElement {
  video_polling = false;
  flipped = false;
  eye_size = 768;
  contrast = 100;
  saturation = 100; 
  brightness = 100;
  hue = 0;
  selected_device = null;
  
  render() {
    const initialize_button = document.createElement('button');
    initialize_button.classList.add('initialize-button')
    initialize_button.innerText = 'Connect';
    initialize_button.addEventListener('click', (e) => {
      this.openEYE();
    });
    this.appendChild(initialize_button);
  }

  createMenu(){
    const menu_container = document.createElement('details');
    const summary = document.createElement('summary');
    menu_container.appendChild(summary);
    this.menu = document.createElement('section');
    menu_container.appendChild(this.menu);
    this.appendChild(menu_container);
  }

  createFlipButton(){
    const flip_button_label = document.createElement('label');
    flip_button_label.innerText = 'Flip Image';
    const flip_checkbox = document.createElement('input');
    flip_checkbox.setAttribute('type', 'checkbox');
    flip_button_label.appendChild(flip_checkbox);
    this.menu.appendChild(flip_button_label);
    flip_checkbox.addEventListener('click', (e) => {
      this.scratch_canvas_context.translate(this.eye_size, 0);
      this.scratch_canvas_context.scale(-1, 1);      
    });
  }

  createContrastSlider(){
    const contrast_slider_label = document.createElement('label');
    contrast_slider_label.innerText = 'Contrast';
    const contrast_slider = document.createElement('input');
    contrast_slider.setAttribute('type', 'range');
    contrast_slider.setAttribute('min', 0);
    contrast_slider.setAttribute('max', 300);
    contrast_slider.value = 100; 
    contrast_slider_label.appendChild(contrast_slider);
    this.menu.appendChild(contrast_slider_label);
    contrast_slider.addEventListener('change', (e) => {
      this.contrast = e.target.value;
    });

    this.contrast_slider = contrast_slider;
  }

  createSaturationSlider(){
    const saturation_slider_label = document.createElement('label');
    saturation_slider_label.innerText = 'Saturate';
    const saturation_slider = document.createElement('input');
    saturation_slider.setAttribute('type', 'range');
    saturation_slider.setAttribute('min', 0);
    saturation_slider.setAttribute('max', 300);
    saturation_slider.value = 100; 
    saturation_slider_label.appendChild(saturation_slider);
    this.menu.appendChild(saturation_slider_label);
    saturation_slider.addEventListener('change', (e) => {
      this.saturation = e.target.value;
    });
    this.saturation_slider = saturation_slider;
  }

  createBrightnessSlider(){
    const Brightness_slider_label = document.createElement('label');
    Brightness_slider_label.innerText = 'Brightness';
    const Brightness_slider = document.createElement('input');
    Brightness_slider.setAttribute('type', 'range');
    Brightness_slider.setAttribute('min', 0);
    Brightness_slider.setAttribute('max', 300);
    Brightness_slider.value = 100; 
    Brightness_slider_label.appendChild(Brightness_slider);
    this.menu.appendChild(Brightness_slider_label);
    Brightness_slider.addEventListener('change', (e) => {
      this.brightness = e.target.value;
    });

    this.brightness_slider = Brightness_slider
  }

  createhueSlider(){
    const hue_slider_label = document.createElement('label');
    hue_slider_label.innerText = 'hue';
    const hue_slider = document.createElement('input');
    hue_slider.setAttribute('type', 'range');
    hue_slider.setAttribute('min', 0);
    hue_slider.setAttribute('max', 360);
    hue_slider.value = 180; 
    hue_slider_label.appendChild(hue_slider);
    this.menu.appendChild(hue_slider_label);
    hue_slider.addEventListener('change', (e) => {
      this.hue = e.target.value;
    });

    this.hue_slider = hue_slider
  }

  createResetButton(){
    const reset_button = document.createElement('button');
    reset_button.innerText = 'Reset'
    this.menu.appendChild(reset_button);
    reset_button.addEventListener('click', (e)=>{
      this.contrast_slider.value = 100;
      this.brightness_slider.value = 100;
      this.saturation_slider.value = 100;
      this.hue_slider.value = 0;

      this.contrast = 100;
      this.saturation = 100; 
      this.brightness = 100;
      this.hue = 0;

    });
  }

  async createSelectedDeviceDropdown(){
    const connected_devices = [...await navigator.mediaDevices.enumerateDevices()].filter(d => d.kind === 'videoinput');
    console.log(connected_devices);
    const video_inputs = document.createElement('select');
    for (let device_index in connected_devices) {
      const device = connected_devices[device_index];
      const option = document.createElement('option');
      option.setAttribute('value', device.deviceId);
      option.innerText = device.label || `Camera ${parseInt(device_index) + 1}`;
      video_inputs.appendChild(option);
    }
    video_inputs.addEventListener('change', (e) => {
      this.selected_device = e.target.value;
      console.log(this.selected_device);
      this.getUserMedia();
    });
    this.menu.appendChild(video_inputs);
  }



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
    this.scratch_canvas.width = this.eye_size;
    this.scratch_canvas.height = this.eye_size;
    this.scratch_canvas_context = this.scratch_canvas.getContext('2d', { preserveDrawingBuffer: true });
    // this.appendChild(this.scratch_canvas);
    // 
    this.final_canvas = document.createElement('canvas');
    this.final_canvas.width = this.eye_size;
    this.final_canvas.height = this.eye_size;
    this.final_canvas_context = this.final_canvas.getContext('2d', { preserveDrawingBuffer: true });
    this.appendChild(this.final_canvas);

    this.video = document.createElement('video');
    this.video.onloadedmetadata = (e) => {
      this.video.play();
    };
    this.getUserMedia();

    this.take_picture_button = document.createElement('button');
    this.take_picture_button.classList.add('take-picture-button');
    this.take_picture_button.innerText = 'Take Picture';
    this.take_picture_button.addEventListener('click', (e)=>{
      e.preventDefault();
      this.takePicture();
    });
    this.appendChild(this.take_picture_button);
    this.createMenu();
    this.createFlipButton();
    this.createContrastSlider();
    this.createSaturationSlider();
    this.createBrightnessSlider();
    this.createhueSlider();
    this.createResetButton();
    this.createSelectedDeviceDropdown();
  }

  async getJpeg() {
    // Convert canvas to Blob and return it
    const image_data = await new Promise(resolve => {
      this.scratch_canvas.toBlob((blob) => {
        resolve(blob);
      }, "image/jpeg", 0.8);
    });
    return image_data;
  }

  async getImageData(){
    const image_data = await this.scratch_canvas.toDataURL('image/png');
    return image_data
  }

  async takePicture(){
    const img = await this.getJpeg();
    this.dispatchEvent(new CustomEvent('NEW PICTURE', {
      detail: img
    }));
  }

  async getUserMedia() {
    this.stopVideoStream()
    const constraints = {
      video: { deviceId: this.selected_device, 
        width: this.eye_size,
        height: this.eye_size 
      }
    };
    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      this.video.srcObject = stream;
      this.video.volume = 0;
      this.video.play();
      this.beginVideoPoll();
    } catch (error) {
      console.error('Error accessing user media:', error);
    }
  }

  async beginVideoPoll() {
    this.video_polling = true;
    this.video_poll = setInterval(() => this.pollVideo(), 250);
  }

  pauseVideoPoll() {
    this.video_polling = false;
    clearInterval(this.video_poll);
  }

  async pollVideo() {
    await this.scratch_canvas_context.drawImage(this.video, 0, 0, this.eye_size, this.eye_size);
    this.scratch_canvas_context.filter = `saturate(${this.saturation}%) brightness(${this.brightness}%) contrast(${this.contrast}%) hue-rotate(${this.hue}deg)`
    const img_data = await this.scratch_canvas_context.getImageData(0,0,this.eye_size, this.eye_size);
    this.final_canvas_context.putImageData(img_data, 0, 0);
  }


  async initialize(){
    this.openEYE();
  }

  connectedCallback(){
    this.render();
  }

  stopVideoStream(){
    if (this.video && this.video.srcObject) {
      let tracks = this.video.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      this.video.srcObject = null;
    }
  }

  disconnectedCallback(){
    // Stop video polling
    this.pauseVideoPoll();
    // Stop the media tracks
    this.stopVideoStream();
  }

  static get observedAttributes() {
    return [];
  }

  attributeChangedCallback(name, old_value, new_value){
    switch(name){
      default:
    }
  }
}

customElements.define('e-y-e', EYE)