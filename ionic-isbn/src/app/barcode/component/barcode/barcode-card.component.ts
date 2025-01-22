import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Barcode} from "../../models/barcode.model";

@Component({
  selector: 'app-barcode',
  templateUrl: './barcode-card.component.html',
  styleUrls: ['./barcode-card.component.scss'],
})
export class BarcodeCardComponent {

  @Input() barcode?: Barcode;
  @Output() fetchInfo : EventEmitter<Barcode> = new EventEmitter();
  @Output() delete : EventEmitter<Barcode> = new EventEmitter();
  @Input() infoLoading: boolean = false;

  constructor() { }
}
