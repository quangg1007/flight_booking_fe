import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  filter,
  of,
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
    private _flightService: FlightService,
    private router: Router
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
        from_departure: ['', [Validators.required, Validators.minLength(3)]],
        from_departure_skyID: [''],
        to_destination: ['', [Validators.required, Validators.minLength(3)]],
        to_destination_skyID: [''],
        date: ['', [Validators.required, this.dateValidator()]],
      },
      { validator: this.differentDestinationsValidator }
    );
  }

  submitForm() {
    const fromEntityId = this.flighSearchForm.get(
      'from_departure_skyID'
    )!.value;
    const toEntityId = this.flighSearchForm.get('to_destination_skyID')!.value;
    const date = this.flighSearchForm.get('date')!.value;

    // Navigate to /flight with query parameters
    this.router.navigate(['/flight'], {
      queryParams: {
        from_departure: fromEntityId,
        to_destination: toEntityId,
        date: date,
      },
    });
  }

  setupAutocomplete() {
    this.setupFieldAutocomplete('from_departure');
    this.setupFieldAutocomplete('to_destination');
  }

  private setupFieldAutocomplete(
    fieldName: 'from_departure' | 'to_destination'
  ) {
    this.flighSearchForm
      .get(fieldName)!
      .valueChanges.pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap((value) => {
          if (value.length < 3) {
            this[fieldName === 'from_departure' ? 'fromResults' : 'toResults'] =
              [];
          }
        }),
        filter((value) => value.length >= 3),
        switchMap((value) => {
          const formattedValue = value.replace(/\s+/g, '-').toLowerCase();
          return this._flightService.getLocations(formattedValue).pipe(
            catchError((error) => {
              console.error(`Error fetching ${fieldName} locations:`, error);
              return of({ data: [] });
            })
          );
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((results) => {
        const resultArray =
          fieldName === 'from_departure' ? 'fromResults' : 'toResults';
        this[resultArray] =
          results.data.length > 0
            ? results.data
            : [{ presentation: { title: 'No data found' } }];
        console.log(`${fieldName} results:`, this[resultArray]);
      });
  }

  selectResult(controlName: string, result: any) {
    const visibleControl = this.flighSearchForm.get(controlName)!;
    const skyIDControl = this.flighSearchForm.get(`${controlName}_skyID`)!;

    visibleControl.setValue(result.presentation.title, { emitEvent: false });
    skyIDControl.setValue(result.navigation!.relevantFlightParams!.skyId, {
      emitEvent: false,
    });

    if (controlName === 'from_departure') {
      this.fromResults = [];
    } else {
      this.toResults = [];
    }

    console.log(skyIDControl!.value);
  }

  // VALIDATOR
  dateValidator() {
    return (control: AbstractControl): { [key: string]: any } | null => {
      // console.log(control.value);
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
    const fromDestination = group.get('from_departure')?.value;
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
