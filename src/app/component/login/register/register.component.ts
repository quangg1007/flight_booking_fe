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
import { ApiService } from 'src/app/services/api.service';

const PASSWORD_PATTERN = /^(?=.*[!@#$%^&*]+)[a-z0-9!@#$%^&*]{6,32}$/;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  formSubmit$ = new Subject<any>();
  registerForm!: FormGroup;
  constructor(private _fb: FormBuilder, private _api: ApiService) {}

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
    console.log('Submit form leh');
  }

  initForm() {
    this.registerForm = this._fb.group(
      {
        username: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(6),
            Validators.pattern(/^[a-z]{6,32}$/i),
          ]),
          this.validateUserNameFromAPIDebounce.bind(this),
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

  validateUserNameFromAPI(
    control: AbstractControl
  ): Observable<ValidationErrors | null> {
    return this._api.validateUsername(control.value).pipe(
      map((isValid) => {
        if (isValid) {
          return null;
        }
        return {
          usernameDuplicated: true,
        };
      })
    );
  }

  validateUserNameFromAPIDebounce(
    control: AbstractControl
  ): Observable<ValidationErrors | null> {
    return timer(300).pipe(
      switchMap(() =>
        this._api.validateUsername(control.value).pipe(
          map((isValid) => {
            if (isValid) {
              return null;
            }
            return {
              usernameDuplicated: true,
            };
          })
        )
      )
    );
  }
}
