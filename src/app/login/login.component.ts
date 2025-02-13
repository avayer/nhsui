import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../main/user.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm: FormGroup;
  showPassword = false;
  registerLink: string = '/register';
  constructor(private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [
        Validators.required,
        Validators.email,
        this.nhsEmailValidator()
      ]],
      password: ['', [
        Validators.required
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
    const emailControl = this.loginForm.get('email');
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

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.userService.login(this.loginForm.value.email, this.loginForm.value.password).subscribe(
        (response) => {
          if(response.failed){
            console.log(response.message);
          } else {
            localStorage.setItem("user", JSON.stringify(response.result));
            this.router.navigate(['nhs', 'oneview']);
          }

        },
        (error) => {
          console.error('Error registering user:', error);
        }
      );
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return field ? (field.invalid && (field.dirty || field.touched)) : false;
  }
}
