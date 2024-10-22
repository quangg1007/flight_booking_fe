import { NgxSliderModule, Options } from '@angular-slider/ngx-slider';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-slider',
  standalone: true,
  imports: [CommonModule, NgxSliderModule],
  templateUrl: './slider.component.html',
  styleUrl: './slider.component.css',
})
export class SliderComponent {
  @Input() minPrice: number = 0;
  @Input() maxPrice: number = 0;

  @Output() priceChange = new EventEmitter<number>();

  value!: number;
  options!: Options;

  ngOnInit(): void {
    this.value = this.maxPrice;
    this.options = {
      floor: this.minPrice,
      ceil: this.maxPrice,
    };
  }
}
