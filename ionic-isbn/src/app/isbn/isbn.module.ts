import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {IonicModule} from "@ionic/angular";
import {IsbnRoutingModule} from "./isbn.routing";
import {ReactiveFormsModule} from "@angular/forms";
import {IsbnListComponent} from "./components/isbn-list/isbn-list.component";
import {HomePage} from "./pages/home/home.page";
import {TypeCodePage} from "./pages/typecode/typecode.component";
import {IsbnFormComponent} from "./components/isbn-form/isbn-form.component";
import {IsbnComponent} from "./components/isbn/isbn.component";

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    IsbnRoutingModule,
    ReactiveFormsModule
  ],
  exports: [HomePage,TypeCodePage],
  declarations: [HomePage,IsbnListComponent,TypeCodePage,IsbnFormComponent,IsbnComponent]
})
export class IsbnModule {}
