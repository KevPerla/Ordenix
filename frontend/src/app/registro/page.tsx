"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { register } from "@/lib/api";

type Rol = "cliente" | "empresa" | "repartidor";

type RegisterData = {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  rol: Rol;

  // Empresa
  nit?: string;
  businessName?: string;
  businessAddress?: string;

  // Repartidor
  dui?: string;
  licenseNumber?: string;
  vehicleType?: "motocicleta";
  motorcyclePlate?: string;
};

export default function RegistroPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [rol, setRol] = useState<Rol>("cliente");

  // Empresa
  const [nit, setNit] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");

  // Repartidor
  const [dui, setDui] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [motorcyclePlate, setMotorcyclePlate] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  function handleRoleChange(newRol: Rol) {
    setRol(newRol);
    setError("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!fullName.trim()) {
      setError("Ingresa tu nombre completo.");
      return;
    }

    if (!email.trim()) {
      setError("Ingresa tu correo electrónico.");
      return;
    }

    if (!phone.trim()) {
      setError("Ingresa tu número de teléfono.");
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    // ==========================================
    // VALIDACIONES DE EMPRESA
    // ==========================================

    if (rol === "empresa") {
      if (!nit.trim()) {
        setError("Ingresa el NIT de la empresa.");
        return;
      }

      if (!businessName.trim()) {
        setError("Ingresa el nombre comercial de la empresa.");
        return;
      }

      if (!businessAddress.trim()) {
        setError("Ingresa la dirección de la empresa.");
        return;
      }
    }

    // ==========================================
    // VALIDACIONES DE REPARTIDOR
    // ==========================================

    if (rol === "repartidor") {
      if (!dui.trim()) {
        setError("Ingresa tu DUI.");
        return;
      }

      if (!licenseNumber.trim()) {
        setError("Ingresa tu número de licencia.");
        return;
      }

      if (!motorcyclePlate.trim()) {
        setError("Ingresa la placa de la motocicleta.");
        return;
      }
    }

    setLoading(true);

    try {
      const data: RegisterData = {
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        password,
        rol,
      };

      // ==========================================
      // DATOS DE EMPRESA
      // ==========================================

      if (rol === "empresa") {
        data.nit = nit.trim();
        data.businessName = businessName.trim();
        data.businessAddress = businessAddress.trim();
      }

      // ==========================================
      // DATOS DE REPARTIDOR
      // ==========================================

      if (rol === "repartidor") {
        data.dui = dui.trim();
        data.licenseNumber = licenseNumber.trim();
        data.vehicleType = "motocicleta";
        data.motorcyclePlate = motorcyclePlate.trim();
      }

      await register(data);

      setSuccess(
        "Cuenta creada correctamente. Ahora puedes iniciar sesión."
      );

      setTimeout(() => {
        router.push("/login");
      }, 1200);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No se pudo crear la cuenta."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      className="
        relative
        flex
        min-h-screen
        items-center
        justify-center
        overflow-hidden
        bg-gradient-to-br
        from-[#DFF5E3]
        via-[#F4FAF5]
        to-[#CDEED4]
        px-4
        py-10
        text-[#172019]
      "
    >
      {/* ==========================================
          DECORACIÓN DE FONDO
      ========================================== */}

      <div
        className="
          pointer-events-none
          absolute
          -left-32
          -top-32
          h-96
          w-96
          rounded-full
          bg-[#22C55E]/15
          blur-3xl
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -bottom-32
          -right-32
          h-96
          w-96
          rounded-full
          bg-[#16A34A]/15
          blur-3xl
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-1/2
          h-72
          w-72
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-white/50
          blur-3xl
        "
      />

      {/* ==========================================
          CONTENEDOR
      ========================================== */}

      <div className="relative w-full max-w-lg">

        {/* ==========================================
            ENCABEZADO
        ========================================== */}

        <div className="mb-7 text-center">

          <div
            className="
              mx-auto
              mb-5
              flex
              h-16
              w-16
              items-center
              justify-center
              rounded-2xl
              bg-gradient-to-br
              from-[#16A34A]
              to-[#14532D]
              text-2xl
              font-black
              text-white
              shadow-lg
              shadow-green-900/20
            "
          >
            O
          </div>

          <h1
            className="
              text-3xl
              font-bold
              tracking-tight
              text-[#172019]
            "
          >
            Crear cuenta
          </h1>

          <p className="mt-2 text-sm text-[#718076]">
            Regístrate para comenzar a usar Ordenix
          </p>
        </div>

        {/* ==========================================
            FORMULARIO
        ========================================== */}

        <form
          onSubmit={handleSubmit}
          className="
            rounded-[28px]
            border
            border-[#DCE8DE]
            bg-white/95
            p-7
            shadow-xl
            shadow-green-900/[0.08]
            backdrop-blur-sm
            sm:p-8
          "
        >

          {/* INDICADOR */}

          <div className="mb-6 flex items-center gap-3">

            <div
              className="
                h-2.5
                w-2.5
                rounded-full
                bg-[#22C55E]
                shadow-[0_0_12px_rgba(34,197,94,0.45)]
              "
            />

            <span
              className="
                text-xs
                font-semibold
                uppercase
                tracking-wider
                text-[#15803D]
              "
            >
              Crear nueva cuenta
            </span>

          </div>

          <div className="grid gap-5">

            {/* ======================================
                NOMBRE
            ====================================== */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#172019]">
                Nombre completo
              </label>

              <div className="relative">

                <div
                  className="
                    pointer-events-none
                    absolute
                    left-4
                    top-1/2
                    flex
                    -translate-y-1/2
                    text-[#8A968E]
                  "
                >
                  <svg
                    width="19"
                    height="19"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4 21c.8-4.1 3.5-6 8-6s7.2 1.9 8 6" />
                  </svg>
                </div>

                <input
                  type="text"
                  value={fullName}
                  onChange={(event) =>
                    setFullName(event.target.value)
                  }
                  placeholder="Nombre de Usuario"
                  required
                  className="
                    h-12
                    w-full
                    rounded-xl
                    border
                    border-[#DCE8DE]
                    bg-[#F7FAF7]
                    pl-11
                    pr-4
                    text-sm
                    text-[#172019]
                    outline-none
                    transition
                    placeholder:text-[#9AA79F]
                    focus:border-[#86EFAC]
                    focus:bg-white
                    focus:ring-4
                    focus:ring-green-100
                  "
                />
              </div>
            </div>

            {/* ======================================
                CORREO
            ====================================== */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#172019]">
                Correo electrónico
              </label>

              <div className="relative">

                <div
                  className="
                    pointer-events-none
                    absolute
                    left-4
                    top-1/2
                    flex
                    -translate-y-1/2
                    text-[#8A968E]
                  "
                >
                  <svg
                    width="19"
                    height="19"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <rect
                      x="3"
                      y="5"
                      width="18"
                      height="14"
                      rx="2"
                    />
                    <path d="m3 7 9 6 9-6" />
                  </svg>
                </div>

                <input
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  placeholder="user@correo.com"
                  required
                  className="
                    h-12
                    w-full
                    rounded-xl
                    border
                    border-[#DCE8DE]
                    bg-[#F7FAF7]
                    pl-11
                    pr-4
                    text-sm
                    text-[#172019]
                    outline-none
                    transition
                    placeholder:text-[#9AA79F]
                    focus:border-[#86EFAC]
                    focus:bg-white
                    focus:ring-4
                    focus:ring-green-100
                  "
                />
              </div>
            </div>

            {/* ======================================
                TELÉFONO
            ====================================== */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#172019]">
                Teléfono
              </label>

              <div className="relative">

                <div
                  className="
                    pointer-events-none
                    absolute
                    left-4
                    top-1/2
                    flex
                    -translate-y-1/2
                    text-[#8A968E]
                  "
                >
                  <svg
                    width="19"
                    height="19"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path d="M6.5 3h3L11 7l-2 1.5a16 16 0 0 0 6.5 6.5L17 13l4 1.5v3c0 1.1-.9 2-2 2C10.7 20.5 3.5 13.3 3.5 5c0-1.1.9-2 2-2Z" />
                  </svg>
                </div>

                <input
                  type="tel"
                  value={phone}
                  onChange={(event) =>
                    setPhone(event.target.value)
                  }
                  placeholder="7000-0000"
                  required
                  className="
                    h-12
                    w-full
                    rounded-xl
                    border
                    border-[#DCE8DE]
                    bg-[#F7FAF7]
                    pl-11
                    pr-4
                    text-sm
                    text-[#172019]
                    outline-none
                    transition
                    placeholder:text-[#9AA79F]
                    focus:border-[#86EFAC]
                    focus:bg-white
                    focus:ring-4
                    focus:ring-green-100
                  "
                />
              </div>
            </div>

            {/* ======================================
                TIPO DE CUENTA
            ====================================== */}

            <div>

              <label className="mb-3 block text-sm font-semibold text-[#172019]">
                Tipo de cuenta
              </label>

              <div className="grid gap-3">

                {/* ==================================
                    CLIENTE
                ================================== */}

                <button
                  type="button"
                  onClick={() => handleRoleChange("cliente")}
                  className={`
                    group
                    flex
                    items-center
                    gap-4
                    rounded-2xl
                    border
                    p-4
                    text-left
                    transition-all
                    duration-200
                    ${
                      rol === "cliente"
                        ? "border-[#86EFAC] bg-[#ECFDF1] shadow-sm shadow-green-900/5"
                        : "border-[#DCE8DE] bg-[#F7FAF7] hover:border-[#BBF7D0] hover:bg-white"
                    }
                  `}
                >

                  {/* ICONO FIJO DE CLIENTE */}

                  <div
                    className={`
                      flex
                      h-11
                      w-11
                      shrink-0
                      items-center
                      justify-center
                      rounded-xl
                      ${
                        rol === "cliente"
                          ? "bg-[#166534] text-white"
                          : "bg-[#E8F0E9] text-[#647067]"
                      }
                    `}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <circle cx="12" cy="8" r="4" />
                      <path d="M4 21c.8-4.1 3.5-6 8-6s7.2 1.9 8 6" />
                    </svg>
                  </div>

                  <div className="flex-1">

                    <p className="text-sm font-bold text-[#172019]">
                      Cliente
                    </p>

                    <p className="mt-0.5 text-xs text-[#718076]">
                      Realiza pedidos y recibe tus entregas
                    </p>

                  </div>

                  <div
                    className={`
                      flex
                      h-5
                      w-5
                      items-center
                      justify-center
                      rounded-full
                      border-2
                      ${
                        rol === "cliente"
                          ? "border-[#16A34A] bg-[#16A34A]"
                          : "border-[#CBD5CE]"
                      }
                    `}
                  >
                    {rol === "cliente" && (
                      <span className="h-2 w-2 rounded-full bg-white" />
                    )}
                  </div>

                </button>

                {/* ==================================
                    EMPRESA
                ================================== */}

                <button
                  type="button"
                  onClick={() => handleRoleChange("empresa")}
                  className={`
                    group
                    flex
                    items-center
                    gap-4
                    rounded-2xl
                    border
                    p-4
                    text-left
                    transition-all
                    duration-200
                    ${
                      rol === "empresa"
                        ? "border-[#86EFAC] bg-[#ECFDF1] shadow-sm shadow-green-900/5"
                        : "border-[#DCE8DE] bg-[#F7FAF7] hover:border-[#BBF7D0] hover:bg-white"
                    }
                  `}
                >

                  {/* ICONO FIJO DE EMPRESA */}

                  <div
                    className={`
                      flex
                      h-11
                      w-11
                      shrink-0
                      items-center
                      justify-center
                      rounded-xl
                      ${
                        rol === "empresa"
                          ? "bg-[#166534] text-white"
                          : "bg-[#E8F0E9] text-[#647067]"
                      }
                    `}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <path d="M3 21h18" />
                      <path d="M5 21V7l7-4 7 4v14" />
                      <path d="M9 21v-5h6v5" />
                      <path d="M8 10h1" />
                      <path d="M15 10h1" />
                      <path d="M8 13h1" />
                      <path d="M15 13h1" />
                    </svg>
                  </div>

                  <div className="flex-1">

                    <p className="text-sm font-bold text-[#172019]">
                      Empresa
                    </p>

                    <p className="mt-0.5 text-xs text-[#718076]">
                      Gestiona pedidos y operaciones
                    </p>

                  </div>

                  <div
                    className={`
                      flex
                      h-5
                      w-5
                      items-center
                      justify-center
                      rounded-full
                      border-2
                      ${
                        rol === "empresa"
                          ? "border-[#16A34A] bg-[#16A34A]"
                          : "border-[#CBD5CE]"
                      }
                    `}
                  >
                    {rol === "empresa" && (
                      <span className="h-2 w-2 rounded-full bg-white" />
                    )}
                  </div>

                </button>

                {/* ==================================
                    REPARTIDOR
                ================================== */}

                <button
                  type="button"
                  onClick={() => handleRoleChange("repartidor")}
                  className={`
                    group
                    flex
                    items-center
                    gap-4
                    rounded-2xl
                    border
                    p-4
                    text-left
                    transition-all
                    duration-200
                    ${
                      rol === "repartidor"
                        ? "border-[#86EFAC] bg-[#ECFDF1] shadow-sm shadow-green-900/5"
                        : "border-[#DCE8DE] bg-[#F7FAF7] hover:border-[#BBF7D0] hover:bg-white"
                    }
                  `}
                >

                  {/* ICONO FIJO DE MOTOCICLETA */}

                  <div
                    className={`
                      flex
                      h-11
                      w-11
                      shrink-0
                      items-center
                      justify-center
                      rounded-xl
                      ${
                        rol === "repartidor"
                          ? "bg-[#166534] text-white"
                          : "bg-[#E8F0E9] text-[#647067]"
                      }
                    `}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <circle cx="6" cy="17" r="3" />
                      <circle cx="18" cy="17" r="3" />
                      <path d="M6 17h4l2-6h3l3 6" />
                      <path d="M10 11H8" />
                      <path d="M12 11l-2-4h4" />
                      <path d="M16 8h2l2 3" />
                    </svg>
                  </div>

                  <div className="flex-1">

                    <p className="text-sm font-bold text-[#172019]">
                      Repartidor
                    </p>

                    <p className="mt-0.5 text-xs text-[#718076]">
                      Gestiona y realiza entregas
                    </p>

                  </div>

                  <div
                    className={`
                      flex
                      h-5
                      w-5
                      items-center
                      justify-center
                      rounded-full
                      border-2
                      ${
                        rol === "repartidor"
                          ? "border-[#16A34A] bg-[#16A34A]"
                          : "border-[#CBD5CE]"
                      }
                    `}
                  >
                    {rol === "repartidor" && (
                      <span className="h-2 w-2 rounded-full bg-white" />
                    )}
                  </div>

                </button>

              </div>
            </div>

            {/* ======================================
                DATOS DE EMPRESA
            ====================================== */}

            {rol === "empresa" && (
              <div
                className="
                  rounded-2xl
                  border
                  border-[#BBF7D0]
                  bg-[#F0FDF4]
                  p-5
                "
              >

                <div className="mb-4">

                  <h3 className="text-sm font-bold text-[#14532D]">
                    Información de la empresa
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-[#718076]">
                    Estos datos serán utilizados para validar que
                    la cuenta pertenece a una empresa.
                  </p>

                </div>

                {/* NIT */}

                <div className="mb-4">

                  <label className="mb-2 block text-sm font-semibold text-[#172019]">
                    NIT
                  </label>

                  <input
                    type="text"
                    value={nit}
                    onChange={(event) =>
                      setNit(event.target.value)
                    }
                    placeholder="0000-000000-000-0"
                    required={rol === "empresa"}
                    className="
                      h-12
                      w-full
                      rounded-xl
                      border
                      border-[#DCE8DE]
                      bg-white
                      px-4
                      text-sm
                      text-[#172019]
                      outline-none
                      transition
                      placeholder:text-[#9AA79F]
                      focus:border-[#86EFAC]
                      focus:ring-4
                      focus:ring-green-100
                    "
                  />

                  <p className="mt-1.5 text-xs text-[#718076]">
                    El NIT será verificado posteriormente por el sistema.
                  </p>

                </div>

                {/* NOMBRE COMERCIAL */}

                <div className="mb-4">

                  <label className="mb-2 block text-sm font-semibold text-[#172019]">
                    Nombre comercial
                  </label>

                  <input
                    type="text"
                    value={businessName}
                    onChange={(event) =>
                      setBusinessName(event.target.value)
                    }
                    placeholder="Ej. Restaurante La Esquina"
                    required={rol === "empresa"}
                    className="
                      h-12
                      w-full
                      rounded-xl
                      border
                      border-[#DCE8DE]
                      bg-white
                      px-4
                      text-sm
                      text-[#172019]
                      outline-none
                      transition
                      placeholder:text-[#9AA79F]
                      focus:border-[#86EFAC]
                      focus:ring-4
                      focus:ring-green-100
                    "
                  />

                </div>

                {/* DIRECCIÓN */}

                <div>

                  <label className="mb-2 block text-sm font-semibold text-[#172019]">
                    Dirección de la empresa
                  </label>

                  <textarea
                    value={businessAddress}
                    onChange={(event) =>
                      setBusinessAddress(event.target.value)
                    }
                    placeholder="Dirección donde opera la empresa"
                    required={rol === "empresa"}
                    rows={3}
                    className="
                      w-full
                      resize-none
                      rounded-xl
                      border
                      border-[#DCE8DE]
                      bg-white
                      px-4
                      py-3
                      text-sm
                      text-[#172019]
                      outline-none
                      transition
                      placeholder:text-[#9AA79F]
                      focus:border-[#86EFAC]
                      focus:ring-4
                      focus:ring-green-100
                    "
                  />

                </div>

              </div>
            )}

            {/* ======================================
                DATOS DE REPARTIDOR
            ====================================== */}

            {rol === "repartidor" && (
              <div
                className="
                  rounded-2xl
                  border
                  border-[#BBF7D0]
                  bg-[#F0FDF4]
                  p-5
                "
              >

                <div className="mb-4">

                  <h3 className="text-sm font-bold text-[#14532D]">
                    Información del repartidor
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-[#718076]">
                    Necesitamos estos datos para validar tu perfil
                    como repartidor.
                  </p>

                </div>

                {/* DUI */}

                <div className="mb-4">

                  <label className="mb-2 block text-sm font-semibold text-[#172019]">
                    DUI
                  </label>

                  <input
                    type="text"
                    value={dui}
                    onChange={(event) =>
                      setDui(event.target.value)
                    }
                    placeholder="00000000-0"
                    required={rol === "repartidor"}
                    className="
                      h-12
                      w-full
                      rounded-xl
                      border
                      border-[#DCE8DE]
                      bg-white
                      px-4
                      text-sm
                      text-[#172019]
                      outline-none
                      transition
                      placeholder:text-[#9AA79F]
                      focus:border-[#86EFAC]
                      focus:ring-4
                      focus:ring-green-100
                    "
                  />

                </div>

                {/* LICENCIA */}

                <div className="mb-4">

                  <label className="mb-2 block text-sm font-semibold text-[#172019]">
                    Número de licencia
                  </label>

                  <input
                    type="text"
                    value={licenseNumber}
                    onChange={(event) =>
                      setLicenseNumber(event.target.value)
                    }
                    placeholder="Número de licencia"
                    required={rol === "repartidor"}
                    className="
                      h-12
                      w-full
                      rounded-xl
                      border
                      border-[#DCE8DE]
                      bg-white
                      px-4
                      text-sm
                      text-[#172019]
                      outline-none
                      transition
                      placeholder:text-[#9AA79F]
                      focus:border-[#86EFAC]
                      focus:ring-4
                      focus:ring-green-100
                    "
                  />

                </div>

                {/* VEHÍCULO */}

                <div className="mb-4">

                  <label className="mb-2 block text-sm font-semibold text-[#172019]">
                    Vehículo
                  </label>

                  <div
                    className="
                      flex
                      items-center
                      gap-3
                      rounded-xl
                      border
                      border-[#86EFAC]
                      bg-white
                      p-4
                    "
                  >

                    <div
                      className="
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-lg
                        bg-[#166534]
                        text-white
                      "
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      >
                        <circle cx="6" cy="17" r="3" />
                        <circle cx="18" cy="17" r="3" />
                        <path d="M6 17h4l2-6h3l3 6" />
                        <path d="M10 11H8" />
                        <path d="M12 11l-2-4h4" />
                        <path d="M16 8h2l2 3" />
                      </svg>
                    </div>

                    <div>

                      <p className="text-sm font-bold text-[#172019]">
                        Motocicleta
                      </p>

                      <p className="text-xs text-[#718076]">
                        Vehículo autorizado para realizar entregas
                      </p>

                    </div>

                  </div>

                </div>

                {/* PLACA */}

                <div>

                  <label className="mb-2 block text-sm font-semibold text-[#172019]">
                    Placa de la motocicleta
                  </label>

                  <input
                    type="text"
                    value={motorcyclePlate}
                    onChange={(event) =>
                      setMotorcyclePlate(event.target.value)
                    }
                    placeholder="Ej. M 123456"
                    required={rol === "repartidor"}
                    className="
                      h-12
                      w-full
                      rounded-xl
                      border
                      border-[#DCE8DE]
                      bg-white
                      px-4
                      text-sm
                      uppercase
                      text-[#172019]
                      outline-none
                      transition
                      placeholder:text-[#9AA79F]
                      focus:border-[#86EFAC]
                      focus:ring-4
                      focus:ring-green-100
                    "
                  />

                </div>

              </div>
            )}

            {/* ======================================
                CONTRASEÑA
            ====================================== */}

            <div>

              <label className="mb-2 block text-sm font-semibold text-[#172019]">
                Contraseña
              </label>

              <div className="relative">

                <div
                  className="
                    pointer-events-none
                    absolute
                    left-4
                    top-1/2
                    flex
                    -translate-y-1/2
                    text-[#8A968E]
                  "
                >
                  <svg
                    width="19"
                    height="19"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <rect
                      x="5"
                      y="10"
                      width="14"
                      height="10"
                      rx="2"
                    />
                    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                  </svg>
                </div>

                <input
                  type="password"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  placeholder="Mínimo 6 caracteres"
                  required
                  className="
                    h-12
                    w-full
                    rounded-xl
                    border
                    border-[#DCE8DE]
                    bg-[#F7FAF7]
                    pl-11
                    pr-4
                    text-sm
                    text-[#172019]
                    outline-none
                    transition
                    placeholder:text-[#9AA79F]
                    focus:border-[#86EFAC]
                    focus:bg-white
                    focus:ring-4
                    focus:ring-green-100
                  "
                />

              </div>
            </div>

            {/* ======================================
                CONFIRMAR CONTRASEÑA
            ====================================== */}

            <div>

              <label className="mb-2 block text-sm font-semibold text-[#172019]">
                Confirmar contraseña
              </label>

              <div className="relative">

                <div
                  className="
                    pointer-events-none
                    absolute
                    left-4
                    top-1/2
                    flex
                    -translate-y-1/2
                    text-[#8A968E]
                  "
                >
                  <svg
                    width="19"
                    height="19"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <rect
                      x="5"
                      y="10"
                      width="14"
                      height="10"
                      rx="2"
                    />
                    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                    <path d="m9 15 2 2 4-4" />
                  </svg>
                </div>

                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(event.target.value)
                  }
                  placeholder="Repite tu contraseña"
                  required
                  className="
                    h-12
                    w-full
                    rounded-xl
                    border
                    border-[#DCE8DE]
                    bg-[#F7FAF7]
                    pl-11
                    pr-4
                    text-sm
                    text-[#172019]
                    outline-none
                    transition
                    placeholder:text-[#9AA79F]
                    focus:border-[#86EFAC]
                    focus:bg-white
                    focus:ring-4
                    focus:ring-green-100
                  "
                />

              </div>
            </div>

            {/* ======================================
                ERROR
            ====================================== */}

            {error && (
              <div
                className="
                  rounded-xl
                  border
                  border-red-200
                  bg-red-50
                  px-4
                  py-3
                  text-sm
                  font-medium
                  text-red-600
                "
              >
                {error}
              </div>
            )}

            {/* ======================================
                ÉXITO
            ====================================== */}

            {success && (
              <div
                className="
                  rounded-xl
                  border
                  border-green-200
                  bg-green-50
                  px-4
                  py-3
                  text-sm
                  font-medium
                  text-[#15803D]
                "
              >
                {success}
              </div>
            )}

            {/* ======================================
                BOTÓN
            ====================================== */}

            <button
              type="submit"
              disabled={loading}
              className="
                mt-1
                flex
                h-12
                w-full
                items-center
                justify-center
                rounded-xl
                bg-gradient-to-r
                from-[#166534]
                to-[#15803D]
                text-sm
                font-bold
                text-white
                shadow-sm
                shadow-green-900/10
                transition-all
                hover:-translate-y-0.5
                hover:shadow-md
                active:scale-[0.98]
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              {loading
                ? "Creando cuenta..."
                : "Crear cuenta"}
            </button>

          </div>

          {/* ======================================
              LOGIN
          ====================================== */}

          <div className="mt-6 border-t border-[#E8EFE9] pt-6 text-center">

            <p className="text-sm text-[#718076]">
              ¿Ya tienes una cuenta?
            </p>

            <Link
              href="/login"
              className="
                mt-2
                inline-block
                text-sm
                font-bold
                text-[#15803D]
                transition
                hover:text-[#166534]
              "
            >
              Iniciar sesión
            </Link>

          </div>

        </form>

        {/* FOOTER */}

        <p className="mt-6 text-center text-xs text-[#718076]">
          © 2026 Ordenix · Gestión de pedidos y entregas
        </p>

      </div>
    </main>
  );
}