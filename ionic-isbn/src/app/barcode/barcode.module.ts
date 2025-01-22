import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {IonicModule} from "@ionic/angular";
import {BarCodeRoutingModule} from "./barcode.routing";
import {HomeView} from "./views/home/home.view";
import {BarcodeCardComponent} from "./component/barcode/barcode-card.component";
import {BarcodeFormComponent} from "./component/barcode-form/barcode-form.component";
import {TypecodeView} from "./views/typecode/typecode.view";
import {ReactiveFormsModule} from "@angular/forms";
import {BarcodeListComponent} from "./component/barcode-list/barcode-list.component";

@NgModule({
  exports: [HomeView],
  declarations: [HomeView, BarcodeCardComponent, BarcodeFormComponent, TypecodeView, BarcodeListComponent],
  imports: [
    CommonModule,
    IonicModule,
    BarCodeRoutingModule,
    ReactiveFormsModule
  ]
})
export class BarcodeModule { }
