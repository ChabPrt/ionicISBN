import { Component } from '@angular/core';
import {BarcodeService} from "../../service/barcode.service";
import {Barcode} from "../../model/barcode.declaration";
import {PacketStatus} from "../../model/network.declaration";

@Component({
  selector: 'app-barcode-list',
  templateUrl: './barcode-list.component.html',
  styleUrls: ['./barcode-list.component.scss'],
})
export class BarcodeListComponent {

  public spinnerOn : string[] = [];

  constructor(public barcodeService: BarcodeService) { }

  handleDelete(bc: Barcode) {
    this.spinnerOn = this.spinnerOn.filter(code => code != bc.code);
    this.barcodeService.delete(bc);
  }

  handleFetchInfo(bc: Barcode){
    this.spinnerOn.push(bc.code);
    this.barcodeService.fetchInfo(bc).state.subscribe({
      next: (state) => {
        if(state == PacketStatus.SENT){
          this.spinnerOn = this.spinnerOn.filter(code => code != bc.code);
        }
      }
    });
  }

}
