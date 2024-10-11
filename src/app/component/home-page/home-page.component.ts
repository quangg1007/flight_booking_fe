import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
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
  flightSearchForm!: FormGroup;
  destroy$ = new Subject<void>();
  fromResults: any[] = [];
  toResults: any[] = [];
  selectedFlightType: 'oneWay' | 'roundTrip' = 'oneWay';
  selectedMultiCity: boolean = false;

  constructor(
    private _fb: FormBuilder,
    private _flightService: FlightService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}
  ngOnInit(): void {
    this.initForm();
    this.setupAutocomplete();
    this.formSubmit$
      .pipe(
        tap(() => this.flightSearchForm.markAsDirty()),
        switchMap(() => validateForm(this.flightSearchForm)),
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
    this.flightSearchForm = this._fb.group(
      {
        from_departure: ['', [Validators.required, Validators.minLength(3)]],
        from_departure_skyID: [''],
        to_destination: ['', [Validators.required, Validators.minLength(3)]],
        to_destination_skyID: [''],
        date: ['', [Validators.required]],
        depart_date: ['0', [Validators.required]],
        return_date: ['0', [Validators.required]],
      },
      { validator: this.differentDestinationsValidator }
    );
  }

  submitForm() {
    const fromEntityId = this.flightSearchForm.get(
      'from_departure_skyID'
    )!.value;
    const toEntityId = this.flightSearchForm.get('to_destination_skyID')!.value;

    if (this.selectedFlightType === 'oneWay') {
      const date = this.flightSearchForm.get('date')!.value;

      console.log(fromEntityId, toEntityId, date);

      this.router.navigate(['/flight'], {
        queryParams: {
          from_departure: fromEntityId,
          to_destination: toEntityId,
          date: date,
        },
      });
    } else {
      const departDate = this.flightSearchForm.get('depart_date')!.value;
      const returnDate = this.flightSearchForm.get('return_date')!.value;

      this.router.navigate(['/flight'], {
        queryParams: {
          from_departure: fromEntityId,
          to_destination: toEntityId,
          depart_date: departDate,
          return_date: returnDate,
        },
      });
    }

    // Navigate to /flight with query parameters
  }

  setupAutocomplete() {
    this.setupFieldAutocomplete('from_departure');
    this.setupFieldAutocomplete('to_destination');
  }

  private setupFieldAutocomplete(
    fieldName: 'from_departure' | 'to_destination'
  ) {
    this.flightSearchForm
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
    const visibleControl = this.flightSearchForm.get(controlName)!;
    const skyIDControl = this.flightSearchForm.get(`${controlName}_skyID`)!;

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

  selectFlightType(type: 'oneWay' | 'roundTrip'): void {
    this.selectedFlightType = type;

    if (type === 'oneWay') {
      const departDateControl = this.flightSearchForm.get('depart_date');
      const returnDateControl = this.flightSearchForm.get('return_date');

      departDateControl?.setValue('0');
      departDateControl?.setErrors(null);
      departDateControl?.updateValueAndValidity();

      returnDateControl?.setValue('0');
      returnDateControl?.setErrors(null);
      returnDateControl?.updateValueAndValidity();
    } else {
      const dateControl = this.flightSearchForm.get('date');

      dateControl?.setValue('0');
      dateControl?.setErrors(null);
      dateControl?.updateValueAndValidity();

      console.log(dateControl!.value);
    }

    this.flightSearchForm.updateValueAndValidity();
    this.cdr.detectChanges();
  }

  toggleMultiCity() {
    this.selectedMultiCity = !this.selectedMultiCity;
  }

  // VALIDATOR
  // dateValidator() {
  //   return (control: AbstractControl): { [key: string]: any } | null => {
  //     // console.log(control.value);
  //     const selectedDate = new Date(control.value);
  //     const currentDate = new Date();
  //     currentDate.setHours(0, 0, 0, 0);

  //     if (selectedDate < currentDate) {
  //       return { pastDate: true };
  //     }
  //     return null;
  //   };
  // }

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
    const control = this.flightSearchForm.get(controlName);

    // console.log(control?.errors);
    if (control?.errors && Object.keys(control?.errors).length > 0) {
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
