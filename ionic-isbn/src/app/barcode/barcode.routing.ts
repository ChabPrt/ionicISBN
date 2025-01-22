import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {HomeView} from "./views/home/home.view";
import {TypecodeView} from "./views/typecode/typecode.view";

const routes: Routes = [
  {
    path: '',
    component: HomeView
  },
  {
    path: 'add',
    component: TypecodeView
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BarCodeRoutingModule {}
