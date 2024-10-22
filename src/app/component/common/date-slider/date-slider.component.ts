import {
  LabelType,
  NgxSliderModule,
  Options,
} from '@angular-slider/ngx-slider';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-date-slider',
  standalone: true,
  imports: [CommonModule, NgxSliderModule],
  templateUrl: './date-slider.component.html',
  styleUrl: './date-slider.component.css',
})
export class DateSliderComponent {
  @Input() minTime: string = '';
  @Input() maxTime: string = '';

  @Output() minTimeValueChanged = new EventEmitter<number>();
  @Output() maxTimeValueChanged = new EventEmitter<number>();

  // options: Options;

  constructor() {}
  dateRange: Date[] = [];

  minTimeValue: number = 0;
  maxTimeValue: number = 0;

  options!: Options;

  ngOnInit(): void {
    this.dateRange = this.createDateRange(this.minTime, this.maxTime);

    this.minTimeValue = this.dateRange[0].getTime();

    this.maxTimeValue = this.dateRange[this.dateRange.length - 1].getTime();

    this.options = {
      stepsArray: this.dateRange.map((date: Date) => {
        return { value: date.getTime() };
      }),
      translate: (value: number, label: LabelType): string => {
        const date = new Date(value);
        return date.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        });
      },
      hideLimitLabels: true,
      hidePointerLabels: false,
      draggableRange: true,
      noSwitching: true,
    };
  }

  onChange(): void {
    this.minTimeValueChanged.emit(this.minTimeValue);
    this.maxTimeValueChanged.emit(this.maxTimeValue);
  }

  createDateRange(minTime: string, maxTime: string): Date[] {
    const minDate = new Date(minTime);
    const maxDate = new Date(maxTime);

    const range: Date[] = [];
    let current = new Date(minDate);

    while (current <= maxDate) {
      range.push(new Date(current));
      current.setMinutes(current.getMinutes() + 15); // 15-minute intervals
    }

    return range;
  }
}
