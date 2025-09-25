# EYE

EYE is my personal photo app. It has a few tweaks that are specifically designed for my own particular neurology.

## Flip / Pause

I write backwards, so the primary feature of this app is to flip an image and pause it. 

"Saving" Images is possible in this application (using local-image component currently), but it not the primary feature of this app. 

## Piping

EYE also broadcasts an "updated canvas" event every frame. 

## Usage

```xml
  <e-y-e></e-y-e>
  <e-y-e target="target_eye"></e-y-e>
```

## Sizing

You can control the size of the `e-y-e` component by adding `width` and `height` attributes. These attributes accept standard CSS values, including pixels (`500px`), viewport units (`50vw`), or percentages (`100%`). If you provide a unitless value, it will be interpreted as pixels.

The component will request a camera feed that matches these dimensions.

**Examples:**

```html
<!-- Set a fixed size in pixels -->
<e-y-e width="640" height="480"></e-y-e>

<!-- Set the width to 80% of the viewport width and create a square canvas -->
<e-y-e width="80vw"></e-y-e>
```

If only one attribute (`width` or `height`) is provided, the component will create a square canvas of that dimension. If neither is provided, it will default to a `768x768` pixel canvas.

## QR Code Reader

The `e-y-e` component includes a QR code reader that can be enabled to detect and decode QR codes from the video stream.

### Enabling the QR Code Reader

To enable the QR code reader, add the `qr-code-reader="true"` attribute to the `<e-y-e>` element:

```html
<e-y-e id="e_y_e" qr-code-reader="true"></e-y-e>
```

### Handling QR Code Events

When a QR code is successfully scanned, the component dispatches a `qr-code-scanned` custom event. The event's `detail` object contains the data from the QR code.

You can listen for this event to get the QR code data and perform actions, such as displaying the data in a dialog and playing a sound.

### Tutorial: Displaying QR Code Data

Here is a full example of how to use the `e-y-e` component with the QR code reader and handle the scanned data in your `index.html` file:

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>E-Y-E with QR Code Reader</title>
  <script type="module" src="./index.js"></script>
  <link rel="stylesheet" type="text/css" href="./index.css">
</head>
<body>

<e-y-e id="e_y_e" qr-code-reader="true"></e-y-e>

<script>
  const eyeElement = document.getElementById('e_y_e');

  eyeElement.addEventListener('qr-code-scanned', (e) => {
    const qrData = e.detail.data;

    // Play a sound to indicate a successful scan
    const audio = new Audio('assets/qr-code-read.wav');
    audio.play();

    // Create and show a dialog with the QR code data
    let dialog = document.querySelector('dialog');
    if (!dialog) {
      dialog = document.createElement('dialog');
      document.body.appendChild(dialog);
    }
    dialog.innerText = qrData;
    dialog.showModal();

    // Close the dialog when clicking outside of it
    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) {
        dialog.close();
      }
    });
  });
</script>

</body>
</html>
```

This tutorial demonstrates how to:
1.  Add the `e-y-e` component with the `qr-code-reader` attribute enabled.
2.  Listen for the `qr-code-scanned` event.
3.  Play a notification sound.
4.  Display the QR code data in a modal dialog.

Make sure you have the `assets/qr-code-read.wav` sound file in your project for the audio notification to work.

---

## Prior Work

The QR Scanning portion of this code is from https://github.com/nimiq/qr-scanner .