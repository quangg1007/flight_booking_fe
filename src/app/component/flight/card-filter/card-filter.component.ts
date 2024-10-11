import { Options } from '@angular-slider/ngx-slider/options';
import { Component } from '@angular/core';
import { NgxSliderModule } from '@angular-slider/ngx-slider';

@Component({
  selector: 'app-card-filter',
  standalone: true,
  imports: [NgxSliderModule],
  templateUrl: './card-filter.component.html',
  styleUrl: './card-filter.component.css',
})
export class CardFilterComponent {
  minValue: number = 1;
  maxValue: number = 8;
  options: Options = {
    floor: 0,
    ceil: 10,
    draggableRange: true,
  };

  value2: number = 100;
  options2: Options = {
    floor: 0,
    ceil: 250,
  };
}
