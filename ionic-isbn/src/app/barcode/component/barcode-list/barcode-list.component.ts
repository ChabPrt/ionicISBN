import { Component } from '@angular/core';
import { BarcodeService } from '../../service/barcode.service';
import { Barcode } from '../../model/barcode.declaration';
import { PacketStatus } from '../../model/network.declaration';

@Component({
  selector: 'app-barcode-list',
  templateUrl: './barcode-list.component.html',
  styleUrls: ['./barcode-list.component.scss'],
})
export class BarcodeListComponent {
  public spinnerOn: string[] = [];

  constructor(public barcodeService: BarcodeService) {}

  handleDelete(barcode: Barcode): void {
    this.spinnerOn = this.spinnerOn.filter((code) => code !== barcode.code);
    this.barcodeService.deleteBarcode(barcode);
  }

  handleFetchInfo(barcode: Barcode): void {
    if (!this.spinnerOn.includes(barcode.code)) {
      this.spinnerOn.push(barcode.code);
      this.barcodeService.fetchBookInfo(barcode).getState().subscribe({
        next: (state) => {
          if (state === PacketStatus.SENT) {
            this.spinnerOn = this.spinnerOn.filter((code) => code !== barcode.code);
          }
        },
        error: () => {
          this.spinnerOn = this.spinnerOn.filter((code) => code !== barcode.code);
        },
      });
    }
  }

  trackByCode(index: number, barcode: Barcode): string {
    return barcode.code;
  }
}
