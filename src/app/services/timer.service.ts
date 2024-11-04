import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TimerService {
  private timeoutSubject = new BehaviorSubject<number>(300); // 300 seconds = 5 minutes
  public timeout$ = this.timeoutSubject.asObservable();
  private timer: any;

  constructor() {}

  startTimer() {
    this.timer = setInterval(() => {
      const currentValue = this.timeoutSubject.value;
      if (currentValue > 0) {
        this.timeoutSubject.next(currentValue - 1);
      } else {
        this.stopTimer();
      }
    }, 1000);
  }

  stopTimer() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  resetTimer() {
    this.timeoutSubject.next(300);
  }
}
