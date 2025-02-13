import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { RegistrationAuth } from '../main/users/user.model';
import { UserService } from '../main/user.service';

@Component({
  selector: 'app-register-auth',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register-auth.component.html',
  styleUrl: './register-auth.component.scss'
})
export class RegisterAuthComponent {
  registerAuthForm: FormGroup;
  showPassword = false;
  registerLink: string = '/register';
  constructor(private fb: FormBuilder,
    private userService: UserService
  ) {
    this.registerAuthForm = this.fb.group({
      email: ['', [
        Validators.required,
        Validators.email,
        this.nhsEmailValidator()
      ]],
      otp: ['', [
        Validators.required
      ]],
      password: ['', [
        Validators.required
      ]],
      confirmPassword: ['', [
        Validators.required,
        this.passwordMatchValidator
      ]]
    });
  }

  nhsEmailValidator() {
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
    const emailControl = this.registerAuthForm.get('email');
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

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    if (confirmPassword?.hasError('passwordMismatch')) {
      confirmPassword.setErrors(null);
    }

    return null;
  }
  
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.registerAuthForm.valid) {
      let userAuth: RegistrationAuth = {
        Email: this.registerAuthForm.value.email,
        OTP: this.registerAuthForm.value.otp,
        Password: this.registerAuthForm.value.password,
        ConfirmPassword: this.registerAuthForm.value.confirmPassword
      };
      this.userService.completeRegistration(userAuth).subscribe(
        (response) => {
          console.log('User registered Completed', response);
        },
        (error) => {
          console.error('Error completing registration:', error);
        }
      );
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.registerAuthForm.get(fieldName);
    return field ? (field.invalid && (field.dirty || field.touched)) : false;
  }
}
