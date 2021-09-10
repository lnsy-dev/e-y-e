



class EYE extends HTMLElement {
  connectedCallback(){

    this.details = document.createElement('details')
    this.details.innerHTML = `<summary> </summary>`

    // Devices
    this.devices_el = document.createElement('details')
    this.devices_el.innerHTML = `<summary>Devices</summary>`
    this.details.appendChild(this.devices_el)
    this.devices = document.createElement('eye-devices')
    this.devices_el.appendChild(this.devices)
    this.devices.addEventListener('audio-input-device-changed', (e) => {
      this.handleAudioInputDeviceChange(e.detail)
    })
    this.devices.addEventListener('audio-output-device-changed', (e) => {
      this.handleAudioOutputDeviceChange(e.detail)

    })    
    this.devices.addEventListener('video-input-device-changed', (e) => {
      this.handleVideoInputDeviceChange(e.detail)
    })

    // Constraints
    this.constraints_el = document.createElement('details')
    this.constraints_el.innerHTML = `<summary>Controls</summary>`
    this.details.appendChild(this.constraints_el)
    this.constraints = document.createElement('eye-controls')
    this.constraints_el.appendChild(this.constraints)
    this.constraints.addEventListener('UPDATE FILTER', (e) => {
      this.video.style.filter = e.detail
    })
    this.appendChild(this.details)

    // Video

    this.video = document.createElement('video')
    this.video.onloadedmetadata = (e) =>{
      this.video.play()
    }
    this.appendChild(this.video)

    this.getUserMedia()

  }

  async getUserMedia(){
    if(!this.audio_constraints && !this.video_constraints){
      this.video.pause()
      return
    }
    const audio = this.audio_constraints;
    const video = this.video_constraints;
    const stream = await navigator.mediaDevices.getUserMedia({ audio, video })
    this.video.srcObject = stream
    this.video.play()

  }

  handleNewConstraints(new_constraints){

  }

  handleAudioInputDeviceChange(new_id){
    if(new_id === "false"){
      this.audio_constraints = false
      this.getUserMedia()
      return
    } else if (!this.audio_constraints){
      this.audio_constraints = {}
    }

    this.audio_constraints.deviceId = new_id
    this.getUserMedia()
  }

  handleAudioOutputDeviceChange(new_id){


    this.getUserMedia()

  } 

  handleVideoInputDeviceChange(new_id){
    if(new_id === "false"){
      this.video_constraints = false
      this.getUserMedia()
      return
    } else if (!this.video_constraints){
      this.video_constraints = {
        facingMode: "environment"

      }
    }
    this.video_constraints.deviceId = new_id
    this.getUserMedia()
  }



}

customElements.define('e-y-e', EYE)






class EyeDevices extends HTMLElement {
  connectedCallback(){

    this.showConnectedDevices()
  }

  async showConnectedDevices(){
    const connected_devices = [...await navigator.mediaDevices.enumerateDevices()]
    let video_options = connected_devices
      .filter((device) => device.kind === 'videoinput')
     
    let audio_input_options = connected_devices.filter((device) => device.kind === 'audioinput')

    let audio_output_options = connected_devices.filter((device) => device.kind === 'audiooutput')

    if(video_options.length){
      const video_input_label = document.createElement('label')
      video_input_label.innerHTML = `Video Input`
      const video_selector = document.createElement('select')
      video_selector.innerHTML = video_options.map((device) => {return `<option value="${device.deviceId}">${device.label}</option>`}).join("") + '<option value="false">none</option>'
      video_input_label.appendChild(video_selector)
      this.appendChild(video_input_label)
      video_selector.addEventListener('change', (e) => {
        this.setAttribute('video-input-device', e.target.value)
      })
      this.setAttribute('video-input-device', video_options[0].deviceId)
    }

    if(audio_input_options.length){
      const audio_input_label = document.createElement('label')
      audio_input_label.innerHTML = `Audio Input`
      const audio_input_selector = document.createElement('select')

      audio_input_selector.innerHTML = audio_input_options.map((device) => {return `<option value="${device.deviceId}">${device.label}</option>`}).join("")+ '<option value="false">none</option>'
      audio_input_label.appendChild(audio_input_selector)
      this.appendChild(audio_input_label)
      audio_input_selector.addEventListener('change', (e) => {
        this.setAttribute('audio-input-device', e.target.value)
      })
      this.setAttribute('audio-input-device', audio_input_options[0].deviceId)
    }

    // if(audio_output_options.length){
    //   const audio_output_label = document.createElement('label')
    //   audio_output_label.innerHTML = 'Audio Output'
    //   const audio_output_selector = document.createElement('select')

    //   audio_output_selector.innerHTML = audio_output_options.map((device) => {return `<option value="${device.deviceId}">${device.label}</option>`}).join("") + '<option value="false">none</option>'
    //   audio_output_label.appendChild(audio_output_selector)
    //   this.appendChild(audio_output_label)
    //   audio_output_selector.addEventListener('change', (e) => {
    //     this.setAttribute('audio-output-device', e.target.value)
    //   })
    //   this.setAttribute('audio-output-device', audio_output_options[0].deviceId)
    // }
  }

  static get observedAttributes() {
    return ['audio-output-device', 'audio-input-device', 'video-input-device', 'video-output-device'];
  }

  attributeChangedCallback(name, old_value, new_value){
    switch(name){
      case "audio-input-device":
        dispatch('audio-input-device-changed', new_value, this)
        break
      case "audio-output-device":
        dispatch('audio-output-device-changed', new_value, this)
        break
      case "video-input-device":
        dispatch('video-input-device-changed', new_value, this)
        break
      default:
    }
  }

}

customElements.define('eye-devices', EyeDevices)





class EyeControls extends HTMLElement {
  connectedCallback(){
    this.form = document.createElement('form')
    this.form.innerHTML = `
    <label>
      brightness
      <input type="range" min="0" max="400" name="brightness">
    </label>
    <label>
      Contrast
      <input type="range" min="0" max="200" name="contrast">
    </label>

    <label>
      Hue
      <input type="range" min="0" max="360" name="hue">
    </label>

    <label>
      Saturation
      <input type="range" min="0" max="360" name="saturation">
    </label>

    `

    this.appendChild(this.form)


    let mousedown = false
    this.form.addEventListener('mousedown', (e) => {
      mousedown = true
    })

    document.body.addEventListener('mouseup', (e) => {
      mousedown = false
    })

    this.form.addEventListener('mousemove', (e) => {
      if(mousedown){
        this.handleSettings()
      }
    })    

    this.form.addEventListener('change', (e) => {
      this.handleSettings(e)
    })

  }

  handleSettings(){
    let settings = {};
    [...this.form.querySelectorAll('input')].forEach(input => {
      settings[input.name] = input.value
    })

    let filter_text = `brightness(${(settings.brightness / 100)}) contrast(${(settings.contrast / 100)}) hue-rotate(${settings.hue}deg) saturate(${settings.saturation / 100})
    `

    dispatch('UPDATE FILTER', filter_text, this)

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

customElements.define('eye-controls', EyeControls)


