import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {BarcodeScanner} from "@capacitor-mlkit/barcode-scanning";
import {Barcode} from "../model/barcode.declaration";

@Injectable({
  providedIn: 'root'
})
export class CameraService {

  public isScanSupported = new BehaviorSubject(false)

  constructor() {
    //On controle que c'est bien dispo
    BarcodeScanner.isSupported().then((result) => {
      this.isScanSupported.next(result.supported);
    });
  }

  /**
   * Méthode utilisée pour ouvrir l'appareil photo du système en mode scan de code barre
   * Les résultats sont transmis sous forme de tableau
   * En cas d'erreur (permission), on retourne null
   */
  async scan(): Promise<Barcode[] | null> {
    const granted = await this.requestPermissions();
    if (!granted) {
      return null;
    }
    const { barcodes } = await BarcodeScanner.scan();
    return barcodes.map(b => {
      return {code: b.rawValue};
    });
  }

  async requestPermissions(): Promise<boolean> {
      const { camera } = await BarcodeScanner.requestPermissions();
      return camera === 'granted' || camera === 'limited';
  }
}
