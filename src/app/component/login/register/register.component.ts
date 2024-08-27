import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import {
  filter,
  map,
  Observable,
  startWith,
  Subject,
  switchMap,
  take,
  tap,
  timer,
} from 'rxjs';
import { UserModel } from 'src/app/models/user.model';
import { userService } from 'src/app/services/user.service';

const PASSWORD_PATTERN = /^(?=.*[!@#$%^&*]+)[a-z0-9!@#$%^&*]{6,32}$/;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  formSubmit$ = new Subject<any>();
  registerForm!: FormGroup;
  constructor(private _fb: FormBuilder, private userService: userService) {}

  ngOnInit() {
    this.initForm();

    this.formSubmit$
      .pipe(
        tap(() => this.registerForm.markAsDirty()),
        switchMap(() =>
          this.registerForm.statusChanges.pipe(
            startWith(this.registerForm.status),
            filter((status) => status !== 'PENDING'),
            take(1)
          )
        ),
        filter((status) => status === 'VALID')
      )
      .subscribe((validationSuccessful) => this.submitForm());
  }

  submitForm() {
    console.log('Submit form');

    const email = this.registerForm.value.email;
    const password = this.registerForm.value.password;

    const newUser: UserModel = {
      email,
      password,
    };

    console.log(newUser);

    this.userService.register(newUser).subscribe(console.log);
  }

  initForm() {
    this.registerForm = this._fb.group(
      {
        email: [
          '',
          Validators.compose([
            Validators.required,
            Validators.pattern(
              /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
            ),
          ]),
          this.validateEmailFromAPIDebounce.bind(this),
        ],
        password: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(6),
            Validators.pattern(PASSWORD_PATTERN),
          ]),
        ],
        confirmPassword: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(6),
            Validators.pattern(PASSWORD_PATTERN),
          ]),
        ],
      },
      {
        validators: this.validateControlsValue('password', 'confirmPassword'),
      }
    );
  }

  validateControlsValue(firstControlName: string, secondControlName: string) {
    return function (formGroup: FormGroup) {
      const firstControl = formGroup.get(firstControlName);
      const secondControl = formGroup.get(secondControlName);
      const firstControlValue = firstControl?.value;
      const secondControlValue = secondControl?.value;
      return firstControlValue === secondControlValue
        ? null
        : {
            valueNotMatch: {
              firstControlValue,
              secondControlValue,
            },
          };
    };
  }

  validateEmailFromAPIDebounce(
    control: AbstractControl
  ): Observable<ValidationErrors | null> {
    return timer(300).pipe(
      switchMap(() => {
        console.log(control.value);
        return this.userService.validateEmail(control.value).pipe(
          map((isValid) => {
            if (isValid) {
              return {
                emailDuplicated: true,
              };
            }
            return null;
          })
        );
      })
    );
  }

  getErrorMessage(controlName: string): string {
    const control = this.registerForm.get(controlName);
    if (control?.errors) {
      if (control.errors['required']) {
        return 'This field is required';
      }
      if (control.errors['minlength']) {
        return `Minimum length is ${control.errors['minlength'].requiredLength} characters`;
      }
      if (control.errors['pattern']) {
        return 'Invalid format';
      }
      if (control.errors['emailDuplicated']) {
        return 'Email is already taken';
      }
      if (
        controlName === 'confirmPassword' &&
        control.errors['valueNotMatch']
      ) {
        return 'Passwords do not match';
      }
    }
    return '';
  }
}
