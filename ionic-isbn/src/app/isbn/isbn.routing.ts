import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './pages/home/home.page';
import {IonicModule} from "@ionic/angular";

const routes: Routes = [
  {
    path: '',
    component: HomePage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes), IonicModule.forRoot()],
  exports: [RouterModule]
})
export class IsbnRoutingModule {}
