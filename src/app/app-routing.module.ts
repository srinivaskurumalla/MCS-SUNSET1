import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DataExportScreenComponent } from './components/data-export-screen/data-export-screen.component';

const routes: Routes = [
  {path:'',component:DataExportScreenComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
