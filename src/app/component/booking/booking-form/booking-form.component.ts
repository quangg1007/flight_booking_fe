import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { LoginComponent } from '../../login/login/login.component';

@Component({
  selector: 'app-booking-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LoginComponent],
  templateUrl: './booking-form.component.html',
  styleUrls: ['./booking-form.component.css'],
})
export class BookingFormComponent {
  bookingForm!: FormGroup;
  currentStep = 1;

  constructor(private _fb: FormBuilder) {}

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.bookingForm = this._fb.group({
      // Personal Information
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      gender: ['', Validators.required],

      // Travel Document
      passportNumber: ['', Validators.required],
      passportExpiry: ['', Validators.required],
      nationality: ['', Validators.required],

      // Contact Information
      address: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      postalCode: ['', Validators.required],
    });
  }

  nextStep() {
    if (this.currentStep < 3) {
      this.currentStep++;
    }
  }

  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  submitForm() {
    if (this.bookingForm.valid) {
      console.log(this.bookingForm.value);
      // Handle form submission
    }
  }
}
