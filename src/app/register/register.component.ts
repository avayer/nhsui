import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { UserService } from '../main/user.service';
import { NewUser } from '../main/users/user.model';
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {
  loginLink: string = "/login"
  registerForm: FormGroup;
  organizations = [
    { id: 1, name: 'North Central London' },
    { id: 2, name: 'North East London' },
    { id: 3, name: 'North West London' },
    { id: 4, name: 'South East London' },
    { id: 5, name: 'South West London' }
  ];

  constructor(private fb: FormBuilder,
    private userService: UserService
  ) {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email, this.nhsEmailValidator()]],
      reason: ['', [Validators.required]],
      organization: ['', Validators.required]
    });
  }

  nhsEmailValidator(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      const email = control.value;
      if (!email) {
        return null;
      }
      
      const isNHSEmail = email.toLowerCase().endsWith('@nhs.net');
      return !isNHSEmail ? {'nhsEmail': true} : null;
    };
  }

  getEmailErrorMessage(): string {
    const emailControl = this.registerForm.get('email');
    if (emailControl?.errors) {
      if (emailControl.errors['required']) {
        return 'Email is required';
      }
      if (emailControl.errors['email']) {
        return 'Please enter a valid email address';
      }
      if (emailControl.errors['nhsEmail']) {
        return 'Please use an NHS email address (@nhs.net)';
      }
    }
    return '';
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.registerForm.valid) {
      let user: NewUser = {
        Email: this.registerForm.value.email,
        FirstName: this.registerForm.value.firstName,
        LastName: this.registerForm.value.lastName,
        Organization: this.registerForm.value.organization,
        RegistrationReason: this.registerForm.value.reason
      };
      this.userService.register(user).subscribe(
        (response) => {
          console.log('User registered successfully:', response);
        },
        (error) => {
          console.error('Error registering user:', error);
        }
      );
    } else {
      this.markFormGroupTouched(this.registerForm);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return field ? (field.invalid && (field.dirty || field.touched)) : false;
  }
}
