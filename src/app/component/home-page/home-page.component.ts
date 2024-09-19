import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  Subject,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import { FlightService } from 'src/app/services/flight.service';
import { validateForm } from 'src/app/util/validation';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
})
export class HomePageComponent implements OnInit, OnDestroy {
  formSubmit$ = new Subject<any>();
  flighSearchForm!: FormGroup;
  destroy$ = new Subject<void>();
  fromResults: any[] = [];
  toResults: any[] = [];

  constructor(
    private _fb: FormBuilder,
    private _flightService: FlightService
  ) {}
  ngOnInit(): void {
    this.initForm();
    this.setupAutocomplete();
    this.formSubmit$
      .pipe(
        tap(() => this.flighSearchForm.markAsDirty()),
        switchMap(() => validateForm(this.flighSearchForm)),
        filter((isValid) => isValid),
        takeUntil(this.destroy$)
      )
      .subscribe(() => this.submitForm());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  initForm() {
    this.flighSearchForm = this._fb.group(
      {
        from_destination: [
          '',
          [Validators.required, Validators.minLength(3)],
          // this.findEverything.bind(this),
        ],
        to_destination: [
          '',
          [Validators.required, Validators.minLength(3)],
          // this.findEverything.bind(this),
        ],
        date: ['', [Validators.required, this.dateValidator()]],
      },
      { validator: this.differentDestinationsValidator }
    );
  }

  submitForm() {
    console.log('Submit form');
  }

  setupAutocomplete() {
    this.flighSearchForm
      .get('from_destination')!
      .valueChanges.pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe((value) => {
        if (value.length >= 3) {
          const fommatedValue = value.replace(/\s+/g, '-').toLowerCase();
          this._flightService
            .getLocations(fommatedValue)
            .subscribe((results) => {
              this.fromResults = results;
              console.log(results);
            });
        } else {
          this.fromResults = [];
        }
      });

    // Repeat similar setup for 'to_destination'
    this.flighSearchForm
      .get('to_destination')!
      .valueChanges.pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe((value) => {
        if (value.length >= 3) {
          const fommatedValue = value.replace(/\s+/g, '-').toLowerCase();
          this._flightService
            .getLocations(fommatedValue)
            .subscribe((results) => {
              this.toResults = results;
              console.log(results);
            });
        } else {
          this.toResults = [];
        }
      });
  }

  selectResult(controlName: string, result: any) {
    this.flighSearchForm.get(controlName)!.setValue(result.name);
    if (controlName === 'from_desination') {
      this.fromResults = [];
    } else {
      this.toResults = [];
    }
  }

  // VALIDATOR
  dateValidator() {
    return (control: AbstractControl): { [key: string]: any } | null => {
      console.log(control.value);
      const selectedDate = new Date(control.value);
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);

      if (selectedDate < currentDate) {
        return { pastDate: true };
      }
      return null;
    };
  }

  differentDestinationsValidator(
    group: FormGroup
  ): { [key: string]: any } | null {
    const fromDestination = group.get('from_destination')?.value;
    const toDestination = group.get('to_destination')?.value;

    return fromDestination &&
      toDestination &&
      fromDestination.toLowerCase() === toDestination.toLowerCase()
      ? { sameDestinations: true }
      : null;
  }

  getErrorMessage(controlName: string): string {
    const control = this.flighSearchForm.get(controlName);
    if (control?.errors) {
      if (control.errors['required']) {
        return 'This field is required';
      }
      if (control.errors['minlength']) {
        return 'This field must be at least 3 characters long';
      }
      if (control.errors['pastDate']) {
        return 'Please select a future date';
      }
      if (control.errors['sameDestinations']) {
        return 'From and To destinations cannot be the same';
      }
    }
    return '';
  }
}
