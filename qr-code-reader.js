import QrScanner from './vendor/qr-scanner.min.js';

export class QRCodeReader {
  processing = false;
  eyeInstance = null;
  lastScannedData = null;
  timeoutActive = false;

  constructor(eyeInstance) {
    this.eyeInstance = eyeInstance;
    this.imageDrawnListener = () => this.processImage();
    this.eyeInstance.addEventListener('IMAGE DRAWN', this.imageDrawnListener);
  }

  drawLines(cornerPoints) {
    this.eyeInstance.drawLine(
      cornerPoints[0].x, cornerPoints[0].y,
      cornerPoints[1].x, cornerPoints[1].y,
      5, 'green');
    this.eyeInstance.drawLine(
      cornerPoints[1].x, cornerPoints[1].y,
      cornerPoints[2].x, cornerPoints[2].y,
      5, 'green');
    this.eyeInstance.drawLine(
      cornerPoints[2].x, cornerPoints[2].y,
      cornerPoints[3].x, cornerPoints[3].y,
      5, 'green');
    this.eyeInstance.drawLine(
      cornerPoints[3].x, cornerPoints[3].y,
      cornerPoints[0].x, cornerPoints[0].y,
      5, 'green');
  }

  async processImage() {
    if (this.processing || this.timeoutActive) return;
    this.processing = true;
    const image = await this.eyeInstance.getImageData();

    QrScanner.scanImage(image, {
        returnDetailedScanResult: true
      })
      .then(result => {
        if (result.data.length < 1) {
          this.processing = false;
          return;
        }

        if (result.data === this.lastScannedData) {
          this.processing = false;
          return; // Same QR code, do nothing.
        }

        // New QR code found
        this.lastScannedData = result.data;
        this.timeoutActive = true;
        setTimeout(() => {
          this.timeoutActive = false;
          this.lastScannedData = null; // Allow re-scanning of the same code after timeout
        }, 10000);

        this.drawLines(result.cornerPoints);
        
        this.eyeInstance.dispatchEvent(new CustomEvent('qr-code-scanned', {
          detail: { data: result.data }
        }));

        this.processing = false;
      })
      .catch(error => {
        this.processing = false;
      });
  }

  destroy() {
    this.eyeInstance.removeEventListener('IMAGE DRAWN', this.imageDrawnListener);
    const dialog = this.eyeInstance.querySelector('dialog');
    if (dialog) {
      dialog.close();
      dialog.remove();
    }
  }
}
