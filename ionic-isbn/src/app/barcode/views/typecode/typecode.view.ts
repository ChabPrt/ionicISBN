import { Component } from '@angular/core';
import { BarcodeService } from '../../services/barcode.service';
import { Barcode } from '../../models/barcode.model';
import { Location } from '@angular/common';

@Component({
  selector: 'app-typecode',
  templateUrl: './typecode.view.html',
  styleUrls: ['./typecode.view.scss'],
})
export class TypecodeView {
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
