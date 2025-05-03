// Account
export interface RegisterParentRequest {
    fullName: string; // nullable: true
    dob: string; // date
}

export interface RegisterParentResponse {
    fullName: string; // nullable: true
    dob: string; // $date
}

export enum role {
    ADMIN = 'ADMIN',
    DOCTOR = 'DOCTOR',
    FATHER = 'FATHER',
    MOTHER = 'MOTHER',
}

export interface RegisterRequest {
    phone: string; // nullable: true
    password: string; // nullable: true
    email: string; // nullable: true
    role: role; 
    registerParent: RegisterParentRequest; // nullable: true
}

export interface RegisterResponse {
    phone: string; // nullable: true
    password: string; // nullable: true
    email: string; // nullable: true
    role: role; // nullable: true
    registerParent: RegisterParentResponse; // nullable: true
}

export interface RegisterResponseBaseResponse {
    status: string; // nullable: true
    message: string; // nullable: true
    data: RegisterResponse; // nullable: true
}

// Authenticate
export interface AuthenticationRequest {
    phone: string; // nullable: true
    password: string; // nullable: true
}

export interface AuthenticationResponse {
    id : string; // $uuid
    phone: string; // nullable: true
    role: role; // nullable: true
    accessToken: string; // nullable: true
}