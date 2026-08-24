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

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number
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

function getBackendMessage(
  data: unknown,
  fallback: string
): string {
  if (data && typeof data === "object" && "message" in data) {
    const message = data.message;

    if (typeof message === "string") {
      return message;
    }

    if (
      Array.isArray(message) &&
      message.every((item) => typeof item === "string")
    ) {
      return message.join(" ");
    }
  }

  return fallback;
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
    throw new ApiError(
      getBackendMessage(
        data,
        "Error comunicándose con el servidor."
      ),
      response.status
    );
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
  if (typeof window === "undefined") {
    throw new ApiError("No autorizado", 401);
  }

  const accessToken = window.localStorage.getItem(
    ACCESS_TOKEN_KEY
  );

  if (!accessToken) {
    throw new ApiError("No autorizado", 401);
  }

  const response = await request<BackendMeResponse>(
    "/auth/me",
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return normalizeUsuario(response);
}
