import { Injectable } from '@angular/core';
import { Barcode } from '../models/barcode.model';
import { BehaviorSubject } from 'rxjs';
import { NetworkService } from './network.service';
import { NetworkPacket } from '../models/network.model';

@Injectable({
  providedIn: 'root',
})
export class BarcodeService {
  private static readonly LOCAL_STORAGE_KEY = 'barcodes';
  public barcodes = new BehaviorSubject<Barcode[]>([]);

  constructor(private networkService: NetworkService) {
    this.loadBarcodesFromStorage();
    this.barcodes.subscribe(() => this.saveBarcodesToStorage());
  }

  /** Supprime un code-barre du cache */
  deleteBarcode(barcode: Barcode): void {
    this.barcodes.next(this.barcodes.value.filter((b) => b !== barcode));
  }

  /** Ajoute un code-barre au cache */
  addBarcode(barcode: Barcode): void {
    this.barcodes.next([...this.barcodes.value, barcode]);
  }

  /** Ajoute plusieurs codes-barres au cache */
  addMultipleBarcodes(barcodes: Barcode[]): void {
    this.barcodes.next([...this.barcodes.value, ...barcodes]);
  }

  /**
   * Récupère les informations d'un livre à partir de son code ISBN.
   * Les informations sont mises à jour dans le cache.
   */
  fetchBookInfo(barcode: Barcode): NetworkPacket {
    const netPacket = this.networkService.submitIsbnAction(barcode);

    netPacket.subscribe({
      next: (isbnInfo) => {
        const barcodeInCache = this.barcodes.value.find((b) => b.code === barcode.code);
        if (barcodeInCache && isbnInfo) {
          barcode.bookMeta = isbnInfo;
          barcodeInCache.bookMeta = isbnInfo;
          this.barcodes.next(this.barcodes.value);
        }
      },
      error: () => {
        console.error(`Failed to fetch book info for barcode: ${barcode.code}`);
      },
    });

    return netPacket;
  }

  /** Charge les codes-barres depuis le localStorage */
  private loadBarcodesFromStorage(): void {
    const savedData = localStorage.getItem(BarcodeService.LOCAL_STORAGE_KEY);
    const barcodes = savedData ? (JSON.parse(savedData) as Barcode[]) : [];
    this.barcodes.next(barcodes);
  }

  /** Sauvegarde les codes-barres dans le localStorage */
  private saveBarcodesToStorage(): void {
    localStorage.setItem(BarcodeService.LOCAL_STORAGE_KEY, JSON.stringify(this.barcodes.value));
  }
}
