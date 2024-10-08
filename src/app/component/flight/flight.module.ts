import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { FlightComponent } from './home/flight.component';
import { FlightRoutingModule } from './flight-routing.module';
import { DetailComponent } from './detail/detail.component';
import { LoadingPageComponent } from '../loading-page/loading-page.component';
import { CardListComponent } from './card-list/card-list.component';
import { CardDetailComponent } from './card-detail/card-detail.component';

@NgModule({
  declarations: [
    FlightComponent,
    DetailComponent,
    LoadingPageComponent,
    CardListComponent,
    CardDetailComponent,
  ],

  imports: [CommonModule, FlightRoutingModule, NgOptimizedImage],
})
export class FlightModule {}
