import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { LoginComponent } from '../../login/login/login.component';
import { AuthService } from 'src/app/services/auth.service';
import { filter, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { userService } from 'src/app/services/user.service';
import { PassengerService } from 'src/app/services/passenger.service';
import { TimerService } from 'src/app/services/timer.service';
import { ActivatedRoute, Router } from '@angular/router';
import { convertSecondsToTime } from 'src/app/util/time';
import { BookingService } from 'src/app/services/booking.service';
import { BookingModel } from 'src/app/models';
import { validateForm } from 'src/app/util/validation';
import { LegInfo } from 'src/app/models/cardDetail.model';

@Component({
  selector: 'app-booking-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LoginComponent],
  templateUrl: './booking-form.component.html',
  styleUrls: ['./booking-form.component.css'],
})
export class BookingFormComponent {
  recentPassengers: any[] = [];
  timeRemainingDisplay: string = '';

  currentStep: number[] = [1];
  isAuth: boolean = false;
  hasFormChanged = false;

  dataEmail: string = '';
  user_id: string = '';
  legInfo: LegInfo[] = [];

  formSubmit$ = new Subject<any>();
  passengers!: FormArray;
  bookingForm!: FormGroup;
  destroy$ = new Subject<void>();

  booking: any;
  passenger: any;
  flightItinerary: any;

  // Create validation groups
  step1Fields = ['firstName', 'lastName', 'dateOfBirth', 'gender'];
  step2Fields = ['passportNumber', 'passportExpiry', 'nationality'];
  step3Fields = ['address', 'city', 'country', 'postalCode'];
  tokenService: any;

  constructor(
    private _fb: FormBuilder,
    private authService: AuthService,
    private timerService: TimerService,
    private router: Router,
    private bookingService: BookingService,
    private route: ActivatedRoute,
    private passengerService: PassengerService
  ) {}

  ngOnInit() {
    this.initEmptyForm();
    this.getItineraryID();
    this.checkAuthAndInitForm();
    this.startBookingTimer();

    this.formSubmit$
      .pipe(
        tap(() => this.bookingForm.markAsDirty()),
        switchMap(() => validateForm(this.bookingForm)),
        filter((isValid) => {
          console.log(isValid);
          return isValid;
        }),
        takeUntil(this.destroy$)
      )
      .subscribe(() => this.confirmBooking());
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.timerService.stopTimer();
  }

  private initEmptyForm(): void {
    this.bookingForm = this._fb.group({
      itineraryId: ['', Validators.required],
      passengers: this._fb.array([]),
    });

    // Add first passenger by default
    this.addPassenger();
  }

  get passengersFormArray() {
    return this.bookingForm.get('passengers') as FormArray;
  }

  // Method to add new passenger
  addPassenger() {
    this.currentStep.push(1);
    this.passengersFormArray.push(this.createPassengerForm());
  }

  // Method to remove passenger
  removePassenger(index: number) {
    this.passengersFormArray.removeAt(index);
    this.currentStep.splice(index, 1);
  }

  // Method to create single passenger form group
  createPassengerForm(): FormGroup {
    return this._fb.group({
      passengerID: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      gender: ['', Validators.required],
      passportNumber: ['', Validators.required],
      passportExpiry: ['', Validators.required],
      nationality: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      postalCode: ['', Validators.required],
    });
  }

  getItineraryID() {
    this.route.queryParams.subscribe((params) => {
      const state = history.state;
      this.legInfo = state.legInfo;
      console.log(JSON.stringify(this.legInfo));

      if (!params['itineraryId'] && this.legInfo) {
        this.router.navigate(['/']);
        return;
      }

      const itineraryID = params['itineraryId'];
      this.bookingForm.get('itineraryId')?.setValue(itineraryID);
      console.log('itineraryId:', this.bookingForm.get('itineraryId')?.value);
    });
  }

  private checkAuthAndInitForm(): void {
    this.authService
      .isAuthenticated()
      .pipe(
        tap((isAuth) => {
          this.isAuth = isAuth;
          if (isAuth) {
            this.loadRecentPassengers();
          }
        })
      )
      .subscribe();
  }

  startBookingTimer() {
    this.timerService.startTimer();
    this.timerService.timeout$.subscribe((time) => {
      this.timeRemainingDisplay = convertSecondsToTime(time);
      if (time === 0) {
        console.log('timeout');
        this.showTimeoutModal();
      }
    });
  }

  showTimeoutModal() {
    const modal = document.getElementById('timeoutModal') as HTMLDialogElement;
    modal.showModal();
  }

  loadRecentPassengers() {
    this.authService
      .getDataFromAccessToken()
      .pipe(
        switchMap((data) => {
          this.user_id = data.user_id;
          return this.passengerService.getPassengerRecentByUserId(data.user_id);
        }),
        tap((passengers) => {
          this.recentPassengers = passengers;
          if (passengers.length > 0) {
            this.initFormWithPassengerData(passengers[0]); // Load most recent by default
          }
        })
      )
      .subscribe();
  }

  selectPassenger(passenger: any) {
    this.initFormWithPassengerData(passenger);
  }

  private initFormWithPassengerData(passenger: any): void {
    const lastIndex = this.passengersFormArray.length - 1;
    const lastPassengerForm = this.passengersFormArray.at(lastIndex);

    const formValues = {
      passengerID: passenger.passenger_id,
      firstName: passenger.first_name,
      lastName: passenger.last_name,
      dateOfBirth: new Date(passenger.date_of_birth)
        .toISOString()
        .split('T')[0],
      gender: passenger.gender,
      passportNumber: passenger.passport_number,
      passportExpiry: passenger.passport_expiry,
      nationality: passenger.nationality,
      address: passenger.street_address,
      city: passenger.city,
      country: passenger.country,
      postalCode: passenger.postal_code,
    };

    // const passengerForm = (this.bookingForm.get('passengers') as FormArray).at(
    //   this.passengersFormArray.length - 1
    // ) as FormGroup;

    // passengerForm.patchValue(formValues);
    lastPassengerForm.patchValue(formValues);
  }

  confirmBooking(): void {
    const itinerary_id = this.bookingForm.get('itineraryId')?.value;
    const passengers_data = this.passengersFormArray.value.map(
      (passengerForm: any) => ({
        first_name: passengerForm.firstName,
        last_name: passengerForm.lastName,
        gender: passengerForm.gender,
        passport_number: passengerForm.passportNumber,
        passport_expiry: passengerForm.passportExpiry,
        nationality: passengerForm.nationality,
        date_of_birth: passengerForm.dateOfBirth,
        street_address: passengerForm.address,
        city: passengerForm.city,
        country: passengerForm.country,
        postal_code: passengerForm.postalCode,
      })
    );

    console.log('itinerary_id:', itinerary_id);
    console.log('passengers_data:', passengers_data);
    this.proceedWithBooking(itinerary_id, passengers_data);
  }

  private proceedWithBooking(itinerary_id: string, passenger_data: any) {
    // Common booking logic
    this.bookingService
      .createBooking({
        itinerary_id: itinerary_id,
        user_id: this.  user_id,
        passenger_data: passenger_data,
      })
      .subscribe((data) => {
        if (data.booking && data.passenger) {
          this.booking = data.booking;
          this.passenger = data.passenger;
          this.flightItinerary = data.itinerary;
          this.closeDialog();
          this.redirectToInvoicePage();
          console.log(data);
        }
      });
  }

  redirectToInvoicePage() {
    console.log('booking', this.booking);
    console.log('passenger', this.passenger);
    console.log('itinerary', this.flightItinerary);

    this.router.navigate(['/invoice'], {
      state: {
        booking: this.booking,
        passenger: this.passenger,
        itinerary: this.flightItinerary,
      },
    });
  }

  openConfirmDialog(): void {
    const dialog = document.getElementById('my_modal_1') as HTMLDialogElement;
    dialog.showModal();
  }

  closeDialog(): void {
    const dialog = document.getElementById('my_modal_1') as HTMLDialogElement;
    dialog.close();
  }
  // Add this method to check current step validation
  isCurrentStepValid(index: number): boolean {
    // console.log('index:', index);
    let fieldsToCheck: string[] = [];

    // this.passengers
    switch (this.currentStep[index]) {
      case 1:
        fieldsToCheck = this.step1Fields;
        break;
      case 2:
        fieldsToCheck = this.step2Fields;
        break;
      case 3:
        fieldsToCheck = this.step3Fields;
        break;
    }

    const passengerForm = (this.bookingForm.get('passengers') as FormArray).at(
      index
    ) as FormGroup;
    return fieldsToCheck.every((field) => {
      const control = passengerForm.get(field);
      return control && control.valid;
    });
  }

  // Modify your nextStep method
  nextStep(index: number) {
    console.log('isCurrentStepValid', this.isCurrentStepValid(index));
    if (this.isCurrentStepValid(index)) {
      this.currentStep[index]++;
    } else {
      // Mark all fields as touched to trigger validation messages
      const passengerForm = (
        this.bookingForm.get('passengers') as FormArray
      ).at(index) as FormGroup;
      Object.keys(passengerForm.controls).forEach((key) => {
        // const control = this.bookingForm.get(key);
        // control?.markAsTouched();
        passengerForm.get(key)?.markAsTouched();
      });
    }
  }

  previousStep(index: number) {
    if (this.currentStep[index] > 1) {
      this.currentStep[index]--;
    }
  }

  private getBackendFieldName(controlName: string): string {
    return controlName.replace(
      /[A-Z]/g,
      (letter) => `_${letter.toLowerCase()}`
    );
  }

  routeToBookingForm() {
    console.log('routeToBookingForm');
    window.location.reload();
  }

  redirectToSearch() {
    this.router.navigate(['/home']);
    window.location.reload();
  }
}
