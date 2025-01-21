import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {IonicModule} from "@ionic/angular";
import {BarCodeRoutingModule} from "./barcode.routing";
import {HomePage} from "./page/home/home.component";
import {BarcodeComponent} from "./component/barcode/barcode.component";
import {BarcodeFormComponent} from "./component/barcode-form/barcode-form.component";
import {TypecodePage} from "./page/typecode/typecode.component";
import {ReactiveFormsModule} from "@angular/forms";
import {BarcodeListComponent} from "./component/barcode-list/barcode-list.component";


@NgModule({
  exports: [HomePage],
  declarations: [HomePage, BarcodeComponent, BarcodeFormComponent, TypecodePage, BarcodeListComponent],
  imports: [
    CommonModule,
    IonicModule,
    BarCodeRoutingModule,
    ReactiveFormsModule
  ]
})
export class BarcodeModule { }
