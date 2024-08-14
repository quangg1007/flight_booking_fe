import { RouterModule, Routes } from '@angular/router';
import { FlightComponent } from './home/flight.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './list/list.component';

const routes: Routes = [
  {
    path: '',
    component: FlightComponent,
    children: [
      {
        path: 'list',
        component: ListComponent,
      },
    ],
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  declarations: [],
  exports: [RouterModule],
})
export class FlightRoutingModule {}
