import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Barcode} from "../../model/barcode.declaration";

@Component({
  selector: 'app-barcode',
  templateUrl: './barcode.component.html',
  styleUrls: ['./barcode.component.scss'],
})
export class BarcodeComponent{

  @Input() barcode?: Barcode;
  @Output() fetchInfo : EventEmitter<Barcode> = new EventEmitter();
  @Output() delete : EventEmitter<Barcode> = new EventEmitter();
  @Input() infoLoading: boolean = false;

  constructor() { }


}
