export type Rol = "cliente" | "empresa" | "repartidor";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  rol: Rol;

  // Datos de empresa
  nombreEmpresa?: string;
  nit?: string;

  // Datos de repartidor
  dui?: string;
  licencia?: string;
  placaMoto?: string;
  modeloMoto?: string;
}

export interface AuthResponse {
  token?: string;
  user?: {
    id: string;
    fullName: string;
    email: string;
    phone?: string;
    rol: Rol;
  };
  message?: string;
}