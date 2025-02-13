export interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    lastLogin: Date | null;
    isApproved: boolean;
    isActive: boolean;
    approvedOn: Date | null;
    registrationReason: string;
    organization: string;
}

export interface NewUser {
    FirstName: string;
    LastName: string;
    Email: string;
    RegistrationReason: string;
    Organization: string;
}

export interface RegistrationAuth {
    Email: string;
    OTP: string;
    Password: string;
    ConfirmPassword: string;
}