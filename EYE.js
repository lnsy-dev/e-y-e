

class EYE extends HTMLElement {
  video_polling = false;
  flipped = false;
  eye_size = 768;
  contrast = 0;
  saturation = 1; 
  brightness = 1;
  
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
    contrast_slider.setAttribute('min', -100);
    contrast_slider.setAttribute('max', 100);
    contrast_slider.value = 0; 
    contrast_slider_label.appendChild(contrast_slider);
    this.menu.appendChild(contrast_slider_label);
    contrast_slider.addEventListener('change', (e) => {
      this.contrast = e.target.value / 100;
    })
  }

  createSaturationSlider(){
    const saturation_slider_label = document.createElement('label');
    saturation_slider_label.innerText = 'Saturate';
    const saturation_slider = document.createElement('input');
    saturation_slider.setAttribute('type', 'range');
    saturation_slider.setAttribute('min', -100);
    saturation_slider.setAttribute('max', 100);
    saturation_slider.value = 0; 
    saturation_slider_label.appendChild(saturation_slider);
    this.menu.appendChild(saturation_slider_label);
    saturation_slider.addEventListener('change', (e) => {
      this.saturation = e.target.value / 100;
    })
  }

  createBrightnessSlider(){
    const Brightness_slider_label = document.createElement('label');
    Brightness_slider_label.innerText = 'Brightness';
    const Brightness_slider = document.createElement('input');
    Brightness_slider.setAttribute('type', 'range');
    Brightness_slider.setAttribute('min', -100);
    Brightness_slider.setAttribute('max', 100);
    Brightness_slider.value = 0; 
    Brightness_slider_label.appendChild(Brightness_slider);
    this.menu.appendChild(Brightness_slider_label);
    Brightness_slider.addEventListener('change', (e) => {
      this.Brightness = e.target.value / 100;
    })
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
    this.appendChild(this.scratch_canvas);
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
    console.log(img);
    this.dispatchEvent(new CustomEvent('NEW PICTURE', {
      detail: img
    }));
  }

  async getUserMedia() {
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
    const img_data = await this.getImageData();
    // this.image_processor.processImage(img_data, this.eye_size, this.eye_size)
    // console.log(img_data);

  }


  async initialize(){
    this.openEYE();
  }

  connectedCallback(){
    this.render();
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