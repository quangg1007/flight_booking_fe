import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlightComponent } from './home/flight.component';
import { FlightRoutingModule } from './flight-routing.module';
import { DetailComponent } from './detail/detail.component';
import { LoadingPageComponent } from '../loading-page/loading-page.component';
import { ListCardComponent } from './list-card/list-card.component';

@NgModule({
  declarations: [
    FlightComponent,
    DetailComponent,
    LoadingPageComponent,
    ListCardComponent,
  ],
  imports: [CommonModule, FlightRoutingModule],
})
export class FlightModule {}
