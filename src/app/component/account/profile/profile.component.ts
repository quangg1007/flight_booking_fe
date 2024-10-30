import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { map, switchMap, tap } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { TokenService } from 'src/app/services/token.service';
import { userService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent {
  isEditing: boolean = false;
  passwordForm!: FormGroup;
  userForm!: FormGroup;
  data: any;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private tokenService: TokenService,
    private userService: userService
  ) {}

  ngOnInit(): void {
    this.initPasswordForm();
    this.initUserForm();
    this.getUserProfile();
  }

  patchUserForm(userData: any) {
    console.log(userData);
    this.userForm.patchValue({
      firstName: userData[0].first_name,
      lastName: userData[0].last_name,
      dateOfBirth: new Date(userData[0].date_of_birth)
        .toISOString()
        .split('T')[0],
      gender: userData[0].gender,
      email: userData[0].email,
      phoneNumber: userData[0].phone_number,
      passportNumber: userData[0].passport_number,
      passportExpiry: userData[0].passport_expiry,
      nationality: userData[0].nationality,
      streetAddress: userData[0].street_address,
      city: userData[0].city,
      country: userData[0].country,
      postalCode: userData[0].postal_code,
    });
  }

  initUserForm() {
    this.userForm = this.fb.group({
      // Personal Information
      firstName: [{ value: '', disabled: true }],
      lastName: [{ value: '', disabled: true }],
      dateOfBirth: [{ value: '', disabled: true }],
      gender: [{ value: 'male', disabled: true }],
      email: [{ value: '', disabled: true }],
      phoneNumber: [{ value: '', disabled: true }],

      // Travel Document
      passportNumber: [{ value: 'AB123456', disabled: true }],
      passportExpiry: [{ value: '2025-12-31', disabled: true }],
      nationality: [{ value: 'United States', disabled: true }],

      // Contact Information
      streetAddress: [{ value: '123 Main Street', disabled: true }],
      city: [{ value: 'New York', disabled: true }],
      country: [{ value: 'United States', disabled: true }],
      postalCode: [{ value: '10001', disabled: true }],
    });
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
    if (this.isEditing) {
      this.userForm.enable();
    } else {
      this.userForm.disable();
      this.saveChanges();
    }
  }

  saveChanges() {
    if (this.userForm.valid) {
      console.log('Saving profile changes:', this.userForm.value);
      // Implement API call to save changes
    }
  }

  getUserProfile() {
    return this.authService
      .getDataFromAccessToken()
      .pipe(
        map((data) => {
          return data.email;
        }),
        switchMap((email) => {
          return this.userService.getUserByEmail(email).pipe(
            tap((user) => {
              this.patchUserForm(user);
            })
          );
        })
      )
      .subscribe();
  }

  initPasswordForm() {
    this.passwordForm = this.fb.group(
      {
        currentPassword: ['', Validators.required],
        newPassword: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', Validators.required],
        verificationCode: ['', Validators.required],
      },
      {
        validator: this.passwordMatchValidator,
      }
    );
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('newPassword')?.value === g.get('confirmPassword')?.value
      ? null
      : { mismatch: true };
  }

  sendVerificationCode() {
    // Implement verification code sending logic
  }

  updatePassword() {
    if (this.passwordForm.valid) {
      // Implement password update logic
    }
  }
}
