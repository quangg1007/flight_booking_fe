import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
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

  currentStep = 1;
  isAuth: boolean = false;
  hasFormChanged = false;

  dataEmail: string = '';
  user_id: string = '';

  formSubmit$ = new Subject<any>();
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
  ) {
    this.initEmptyForm();
  }

  private initEmptyForm(): void {
    this.bookingForm = this._fb.group({
      itineraryId: ['', Validators.required],
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

  ngOnInit() {
    this.checkAuthAndInitForm();
    this.getItineraryID();
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
    this.timerService.stopTimer();
  }

  getItineraryID() {
    this.route.queryParams.subscribe((params) => {
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

    this.bookingForm.patchValue(formValues);
  }

  openConfirmDialog(): void {
    const dialog = document.getElementById('my_modal_1') as HTMLDialogElement;
    dialog.showModal();
  }

  closeDialog(): void {
    const dialog = document.getElementById('my_modal_1') as HTMLDialogElement;
    dialog.close();
  }

  confirmBooking(): void {
    const itinerary_id = this.bookingForm.get('itineraryId')?.value;
    const first_name = this.bookingForm.get('firstName')?.value;
    const last_name = this.bookingForm.get('lastName')?.value;
    const gender = this.bookingForm.get('gender')?.value;
    const passport_number = this.bookingForm.get('passportNumber')?.value;
    const passport_expiry = this.bookingForm.get('passportExpiry')?.value;
    const nationality = this.bookingForm.get('nationality')?.value;
    const date_of_birth = this.bookingForm.get('dateOfBirth')?.value;
    const street_address = this.bookingForm.get('address')?.value;
    const city = this.bookingForm.get('city')?.value;
    const country = this.bookingForm.get('country')?.value;
    const postal_code = this.bookingForm.get('postalCode')?.value;

    const passenger_data = {
      first_name,
      last_name,
      gender,
      passport_number,
      passport_expiry,
      nationality,
      date_of_birth,
      street_address,
      city,
      country,
      postal_code,
      user: this.user_id,
    };

    console.log('itinerary_id:', itinerary_id);
    this.proceedWithBooking(itinerary_id, passenger_data);

    // this.passengerService.createPassenger(formValues).subscribe(() => {
    //   this.proceedWithBooking();
    // });
  }

  private proceedWithBooking(itinerary_id: string, passenger_data: any) {
    // Common booking logic
    this.bookingService
      .createBooking({
        itinerary_id: itinerary_id,
        booking_date: '2024-10-30T15:50:00',
        status: 'approved',
        total_price: 139.23,
        user_id: this.user_id,
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
    this.router.navigate(['/invoice'], {
      state: {
        booking: this.booking,
        passenger: this.passenger,
        itinerary: this.flightItinerary,
      },
    });
  }

  // Add this method to check current step validation
  isCurrentStepValid(): boolean {
    let fieldsToCheck: string[] = [];

    switch (this.currentStep) {
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

    return fieldsToCheck.every((field) => {
      const control = this.bookingForm.get(field);
      return control && control.valid;
    });
  }

  // Modify your nextStep method
  nextStep() {
    console.log('isCurrentStepValid', this.isCurrentStepValid());
    if (this.isCurrentStepValid()) {
      this.currentStep++;
    } else {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.bookingForm.controls).forEach((key) => {
        const control = this.bookingForm.get(key);
        control?.markAsTouched();
      });
    }
  }

  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
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
