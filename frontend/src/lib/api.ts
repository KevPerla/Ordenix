import type { Rol, Usuario } from "@/types/auth";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:3001";

export const ACCESS_TOKEN_KEY = "ordenix_access_token";

export interface RegisterRequest {
  nombreCompleto: string;
  correo: string;
  telefono: string;
  password: string;
}

export interface RegisterResponse {
  id: string;
  nombreCompleto: string;
  correo: string;
  telefono: string;
  rol: Rol;
}

export interface LoginRequest {
  correo: string;
  password: string;
}

interface BackendAuthUser {
  id: string;
  nombreCompleto: string;
  correo: string;
  rol: Rol;
}

interface BackendLoginResponse {
  accessToken: string;
  user: BackendAuthUser;
}

interface BackendMeResponse extends BackendAuthUser {
  telefono: string;
}

export interface LoginResponse {
  accessToken: string;
  user: Usuario;
}

interface SobreExito<T> {
  exito: true;
  datos: T;
}

interface SobreError {
  exito: false;
  error: {
    tipo: "DOMINIO" | "SEGURIDAD" | "INFRAESTRUCTURA";
    codigo: string;
    mensaje: string;
    detalles?: unknown;
  };
}

type Sobre<T> = SobreExito<T> | SobreError;

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly codigo = "ERROR_DESCONOCIDO",
    public readonly detalles?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

function normalizeUsuario(user: BackendAuthUser): Usuario {
  return {
    id: user.id,
    nombre: user.nombreCompleto,
    email: user.correo,
    rol: user.rol,
  };
}

function esSobre<T>(data: unknown): data is Sobre<T> {
  return typeof data === "object" && data !== null && "exito" in data;
}

function describirError(data: unknown, respaldo: string): {
  mensaje: string;
  codigo: string;
  detalles?: unknown;
} {
  if (esSobre(data) && !data.exito) {
    const detalles = data.error.detalles;

    const mensaje =
      Array.isArray(detalles) &&
      detalles.every((item) => typeof item === "string")
        ? detalles.join(" ")
        : data.error.mensaje;

    return { mensaje, codigo: data.error.codigo, detalles };
  }

  return { mensaje: respaldo, codigo: "ERROR_DESCONOCIDO" };
}

export interface AreaResponse {
  rol: Rol;
  area: string;
  lema: string;
  permisos: string[];
}

function getAccessToken(): string {
  if (typeof window === "undefined") {
    throw new ApiError("No autorizado", 401);
  }

  const accessToken = window.localStorage.getItem(ACCESS_TOKEN_KEY);

  if (!accessToken) {
    throw new ApiError("No autorizado", 401);
  }

  return accessToken;
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  let data: unknown = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const { mensaje, codigo, detalles } = describirError(
      data,
      "Error comunicándose con el servidor."
    );

    throw new ApiError(mensaje, response.status, codigo, detalles);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  if (esSobre<T>(data) && data.exito) {
    return data.datos;
  }

  return data as T;
}

export async function register(
  data: RegisterRequest
): Promise<RegisterResponse> {
  return request<RegisterResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function login(
  data: LoginRequest
): Promise<LoginResponse> {
  const response = await request<BackendLoginResponse>(
    "/auth/login",
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );

  return {
    accessToken: response.accessToken,
    user: normalizeUsuario(response.user),
  };
}

export async function getMe(): Promise<Usuario> {
  const response = await request<BackendMeResponse>(
    "/auth/me",
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
      },
    }
  );

  return normalizeUsuario(response);
}

export async function getArea(
  endpoint: string
): Promise<AreaResponse> {
  return request<AreaResponse>(endpoint, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getAccessToken()}`,
    },
  });
}

export interface Categoria {
  id: string;
  nombre: string;
  descripcion: string | null;
  activo: boolean;
  createdAt: string;
}

export interface Producto {
  id: string;
  categoriaId: string;
  nombre: string;
  descripcion: string | null;
  precioSinIva: number;
  iva: number;
  precioConIva: number;
  imagenUrl: string | null;
  stock: number;
  disponible: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GuardarCategoria {
  nombre: string;
  descripcion?: string;
  activo?: boolean;
}

export interface GuardarProducto {
  categoriaId: string;
  nombre: string;
  descripcion?: string;
  precio: number;
  imagenUrl?: string;
  stock: number;
  disponible?: boolean;
}

function conSesion(extra: Record<string, string> = {}): HeadersInit {
  return { Authorization: `Bearer ${getAccessToken()}`, ...extra };
}

export function listarCategorias(incluirInactivas = false): Promise<Categoria[]> {
  const query = incluirInactivas ? "?incluirInactivas=true" : "";
  return request<Categoria[]>(`/categorias${query}`, {
    method: "GET",
    headers: conSesion(),
  });
}

export function crearCategoria(datos: GuardarCategoria): Promise<Categoria> {
  return request<Categoria>("/categorias", {
    method: "POST",
    headers: conSesion(),
    body: JSON.stringify(datos),
  });
}

export function actualizarCategoria(
  id: string,
  datos: Partial<GuardarCategoria>
): Promise<Categoria> {
  return request<Categoria>(`/categorias/${id}`, {
    method: "PATCH",
    headers: conSesion(),
    body: JSON.stringify(datos),
  });
}

export function eliminarCategoria(id: string): Promise<void> {
  return request<void>(`/categorias/${id}`, {
    method: "DELETE",
    headers: conSesion(),
  });
}

export function listarProductos(filtro: {
  categoriaId?: string;
  soloDisponibles?: boolean;
  busqueda?: string;
} = {}): Promise<Producto[]> {
  const parametros = new URLSearchParams();

  if (filtro.categoriaId) parametros.set("categoriaId", filtro.categoriaId);
  if (filtro.soloDisponibles) parametros.set("soloDisponibles", "true");
  if (filtro.busqueda) parametros.set("busqueda", filtro.busqueda);

  const query = parametros.toString();

  return request<Producto[]>(`/productos${query ? `?${query}` : ""}`, {
    method: "GET",
    headers: conSesion(),
  });
}

export function crearProducto(datos: GuardarProducto): Promise<Producto> {
  return request<Producto>("/productos", {
    method: "POST",
    headers: conSesion(),
    body: JSON.stringify(datos),
  });
}

export function actualizarProducto(
  id: string,
  datos: Partial<GuardarProducto>
): Promise<Producto> {
  return request<Producto>(`/productos/${id}`, {
    method: "PATCH",
    headers: conSesion(),
    body: JSON.stringify(datos),
  });
}

export function eliminarProducto(id: string): Promise<void> {
  return request<void>(`/productos/${id}`, {
    method: "DELETE",
    headers: conSesion(),
  });
}
