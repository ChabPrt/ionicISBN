import { Component } from '@angular/core';
import {BarcodeService} from "../../service/barcode.service";
import {Barcode} from "../../model/barcode.declaration";
import {Location} from "@angular/common";

@Component({
  selector: 'app-typecode',
  templateUrl: './typecode.component.html',
  styleUrls: ['./typecode.component.scss'],
})
export class TypecodePage {

  constructor(private barcodeService: BarcodeService,private location: Location) { }


  handleAddBarCode(code: string) {
    const barcodeModel : Barcode = {
      code: code,
    }
    this.barcodeService.add(barcodeModel);
    this.location.back();
  }
}
