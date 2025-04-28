export interface LoginRequest {
    email: string;
    password: string;
  }
  
  export interface RegisterRequest {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
  }
  
  export interface UserResponse {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  }