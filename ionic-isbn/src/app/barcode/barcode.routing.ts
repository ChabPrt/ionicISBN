import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {HomePage} from "./page/home/home.component";
import {TypecodePage} from "./page/typecode/typecode.component";

const routes: Routes = [
  {
    path: '',
    component: HomePage
  },
  {
    path: 'add',
    component: TypecodePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BarCodeRoutingModule {}
