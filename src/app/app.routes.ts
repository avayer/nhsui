import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { RegisterAuthComponent } from './register-auth/register-auth.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'register',
        component: RegisterComponent,
    },
    {
        path: 'register-auth',
        component: RegisterAuthComponent,
    },
    {
        path: 'forgot',
        component: ForgotPasswordComponent,
    },
    {
        path: 'nhs',
        loadChildren: () => import('./main/main-routing.module').then(m => m.MainRoutingModule)
    }
];
