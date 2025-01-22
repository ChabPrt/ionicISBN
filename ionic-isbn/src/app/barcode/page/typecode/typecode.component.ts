import { Component } from '@angular/core';
import { BarcodeService } from '../../service/barcode.service';
import { Barcode } from '../../model/barcode.model';
import { Location } from '@angular/common';

@Component({
  selector: 'app-typecode',
  templateUrl: './typecode.component.html',
  styleUrls: ['./typecode.component.scss'],
})
export class TypecodePage {
  constructor(
    private barcodeService: BarcodeService,
    private location: Location
  ) {}

  handleAddBarCode(code: string): void {
    if (!code || code.trim() === '') {
      console.warn('Code barre vide ou invalide.');
      return;
    }

    const barcodeModel: Barcode = {
      code: code.trim(),
    };

    this.barcodeService.addBarcode(barcodeModel);
    this.location.back();
  }
}
