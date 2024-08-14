import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlightComponent } from './home/flight.component';
import { FlightRoutingModule } from './flight-routing.module';
import { ListComponent } from './list/list.component';
import { DetailComponent } from './detail/detail.component';

@NgModule({
  declarations: [FlightComponent, ListComponent, DetailComponent],
  imports: [CommonModule, FlightRoutingModule],
})
export class FlightModule {}
