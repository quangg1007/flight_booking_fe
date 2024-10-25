import {
  LabelType,
  NgxSliderModule,
  Options,
} from '@angular-slider/ngx-slider';
import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  EventEmitter,
  input,
  Input,
  output,
  Output,
  signal,
  Signal,
  WritableSignal,
} from '@angular/core';

@Component({
  selector: 'app-date-slider',
  standalone: true,
  imports: [CommonModule, NgxSliderModule],
  templateUrl: './date-slider.component.html',
  styleUrl: './date-slider.component.css',
})
export class DateSliderComponent {
  minTime = input.required<string>();
  maxTime = input.required<string>();

  minTimeValueChanged = output<number>();
  maxTimeValueChanged = output<number>();

  minTimeValue: number = 0;
  maxTimeValue: number = 0;

  options!: Options;

  ngOnInit(): void {
    const dateRange = computed(() => this.createDateRange());

    this.minTimeValue = dateRange()[0].getTime();

    this.maxTimeValue = dateRange()[dateRange().length - 1].getTime();

    this.options = {
      stepsArray: dateRange().map((date: Date) => {
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

  createDateRange() {
    const minDate = new Date(this.minTime());
    const maxDate = new Date(this.maxTime());

    const range: Date[] = [];
    let current = new Date(minDate);

    while (current <= maxDate) {
      range.push(new Date(current));
      current.setMinutes(current.getMinutes() + 15); // 15-minute intervals
    }

    return range;
  }
}
