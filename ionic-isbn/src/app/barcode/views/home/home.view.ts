import { Component } from '@angular/core';
import { CameraService } from '../../services/camera.service';
import { BarcodeService } from '../../services/barcode.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.view.html',
  styleUrls: ['./home.view.scss'],
})
export class HomeView {
  constructor(
    public cameraService: CameraService,
    private barcodeService: BarcodeService,
    private alertController: AlertController
  ) {}

  async handleScan(): Promise<void> {
    if (!this.cameraService.isScanSupported.value) {
      await this.showError(
        'Scanneur non supporté',
        'Votre appareil ne prend pas en charge le scanneur de code-barres.'
      );
      return;
    }

    try {
      const result = await this.cameraService.scanBarcodes();

      if (!result || result.length === 0) {
        await this.showError(
          'Aucun code-barres trouvé',
          'Aucun code-barres n’a été détecté lors du scan.'
        );
        return;
      }

      this.barcodeService.addMultipleBarcodes(result);
    } catch (error) {
      await this.showError(
        'Erreur lors du scan',
        "Une erreur est survenue pendant le scan. Merci de réessayer."
      );
      console.error('Scan error:', error);
    }
  }

  private async showError(header: string, message: string): Promise<void> {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['Ok'],
    });
    await alert.present();
  }
}
