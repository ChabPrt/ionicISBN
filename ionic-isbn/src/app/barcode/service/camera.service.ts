import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { Barcode } from '../model/barcode.declaration';

@Injectable({
  providedIn: 'root',
})
export class CameraService {
  public isScanSupported = new BehaviorSubject(false);

  constructor() {
    this.checkScannerSupport();
  }

  /** Vérifie si le scanner est supporté sur l'appareil */
  private async checkScannerSupport(): Promise<void> {
    const result = await BarcodeScanner.isSupported();
    this.isScanSupported.next(result.supported);
  }

  /**
   * Ouvre l'appareil photo pour scanner des codes-barres.
   * Retourne une liste de résultats ou `null` en cas d'échec.
   */
  async scanBarcodes(): Promise<Barcode[] | null> {
    const granted = await this.requestCameraPermissions();
    if (!granted) {
      return null;
    }

    const { barcodes } = await BarcodeScanner.scan();
    return barcodes.map((b) => ({ code: b.rawValue }));
  }

  /** Demande les permissions pour accéder à la caméra */
  private async requestCameraPermissions(): Promise<boolean> {
    const { camera } = await BarcodeScanner.requestPermissions();
    return camera === 'granted' || camera === 'limited';
  }
}
