# Ordenix

Sistema de gestión de pedidos y delivery. Este avance integra frontend web, API
backend y base de datos en la nube, con el ciclo completo de registro y
autenticación de usuarios desplegado sobre AWS.

## Estructura

```
Ordenix/
├── backend/     API NestJS bajo Clean Architecture
├── frontend/    Aplicación web Next.js + React
├── database/    Esquema SQL del modelo Entidad-Relación
└── .github/     Integración continua y despliegue a AWS
```

## Stack

| Capa | Tecnología |
|---|---|
| Presentación | React 19 + Next.js 16 + Tailwind CSS 4 |
| Servicios / API | NestJS 11 (Node.js + TypeScript) |
| Datos | PostgreSQL en Amazon RDS |
| Cómputo | Amazon EC2 con pm2 |
| Entrega continua | GitHub Actions |

## Arquitectura del backend

El backend se organiza en cuatro capas concéntricas. Las dependencias apuntan
siempre hacia el interior: la capa de aplicación conoce interfaces, nunca
implementaciones.

```
Infrastructure  →  Adapters  →  Application  →  Domain
```

| Capa | Contenido |
|---|---|
| `domain/` | Entidad `User`, enum `UserRole`, alcance por rol y contrato del repositorio |
| `application/` | Casos de uso y puertos (`PasswordHasher`, `TokenService`, `IdGenerator`) |
| `adapters/` | Controladores REST, DTOs, guards y decoradores |
| `infrastructure/` | TypeORM, BCrypt, JWT y configuración de base de datos |

El enlace entre cada puerto y su implementación se declara en `auth.module.ts`
mediante tokens de inyección, de modo que los casos de uso son independientes de
NestJS, de TypeORM y de la librería de cifrado.

## Base de datos

El modelo Entidad-Relación son ocho tablas normalizadas. La estructura completa
se crea desde el inicio y cada avance incorpora los módulos que la consumen.

| Tabla | Contenido |
|---|---|
| `users` | Clientes, administradores y repartidores |
| `addresses` | Direcciones de entrega del cliente |
| `categories` | Categorías del catálogo |
| `products` | Productos con precio y existencias |
| `orders` | Pedidos y su estado |
| `order_items` | Detalle de cada pedido |
| `order_status_history` | Bitácora de cambios de estado |
| `cash_settlements` | Liquidación de efectivo del repartidor |

El esquema vive en `database/schema.sql` y se aplica sobre la instancia de
Amazon RDS con `npm run db:init` desde `backend/`.

## Backend

```bash
cd backend
npm install
cp .env.example .env
```

Completa `.env` con el endpoint de RDS, las credenciales y un secreto para
firmar los tokens. Luego aplica el esquema, crea el administrador inicial y
levanta el servidor:

```bash
npm run db:init
npm run seed:admin
npm run start:dev
```

La API queda disponible en `http://localhost:3001`.

### Variables de entorno

| Variable | Uso |
|---|---|
| `PORT` | Puerto de escucha de la API |
| `FRONTEND_ORIGIN` | Orígenes permitidos por CORS, separados por coma |
| `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` | Conexión a Amazon RDS |
| `DB_SSL`, `DB_SSL_CA_PATH` | TLS contra RDS y ruta al bundle de certificados. RDS exige `DB_SSL=true`; con la ruta vacia la conexion va cifrada pero sin validar el certificado |
| `JWT_SECRET`, `JWT_EXPIRES_IN` | Firma y vigencia del token |
| `ADMIN_*` | Datos del administrador inicial que crea el seed |

### Endpoints

| Método | Ruta | Acceso |
|---|---|---|
| `GET` | `/health` | Público |
| `POST` | `/auth/register` | Público |
| `POST` | `/auth/login` | Público |
| `GET` | `/auth/me` | Requiere token |
| `GET` | `/areas/cliente` | Rol CLIENTE |
| `GET` | `/areas/reparto` | Rol REPARTIDOR |
| `GET` | `/areas/administracion` | Rol ADMINISTRADOR |

## Frontend

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

La aplicación queda disponible en `http://localhost:3000`.

### Rutas

| Ruta | Acceso |
|---|---|
| `/login` | Público |
| `/registro` | Público |
| `/cliente/**` | Rol CLIENTE |
| `/empresa/**` | Rol ADMINISTRADOR |
| `/repartidor/**` | Rol REPARTIDOR |

Cada área está envuelta por `ProtegerRuta`, que redirige al login cuando no hay
sesión y al panel propio cuando el rol no corresponde.

## Seguridad

- Las contraseñas se almacenan con BCrypt y salt de 12 rondas. La base rechaza
  cualquier valor sin formato de hash mediante una restricción `CHECK`.
- `JwtAuthGuard` valida el token de la cabecera `Authorization: Bearer` en cada
  ruta protegida; `RolesGuard` verifica además el rol declarado con `@Roles`.
- El rol no se acepta en el registro público: toda cuenta nueva se crea como
  CLIENTE.
- El arranque falla si `JWT_SECRET` no está definido.
- Las credenciales se leen de variables de entorno y no se versionan.

## Despliegue en AWS

| Componente | Servicio |
|---|---|
| Base de datos | Amazon RDS for PostgreSQL, con TLS y bundle de certificados global |
| API | Amazon EC2, proceso administrado con pm2 (`backend-posgrado`) |
| Aplicación web | Amazon EC2, proceso administrado con pm2 (`frontend-ordenix`) |

`.github/workflows/deploy-backend.yml` y `deploy-frontend.yml` publican cada
componente al fusionar en `main`. Ambos hacen `npm ci`, compilan, reinician el
proceso en pm2 y verifican salud antes de dar el despliegue por bueno; si el
servicio no responde, el workflow falla y deja el log de pm2.

Secretos requeridos en el repositorio: `EC2_HOST`, `EC2_USER` y `EC2_SSH_KEY`.

## Flujo de trabajo en Git

La rama `main` está protegida: nadie escribe directo sobre ella. Todo cambio
entra por Pull Request revisado y aprobado por otra persona de la célula.

```bash
git switch -c feat/nombre-del-cambio
git commit -m "feat: descripcion corta"
git push -u origin feat/nombre-del-cambio
gh pr create --base main
```

Para activar la protección: **Settings → Branches → Add branch protection rule**,
patrón `main`, con estas casillas marcadas:

| Opción | Estado |
|---|---|
| Require a pull request before merging | Activada |
| Require approvals (mínimo 1) | Activada |
| Require status checks to pass (`Backend`, `Frontend`) | Activada |
| Dismiss stale pull request approvals when new commits are pushed | Activada |
| Do not allow bypassing the above settings | Activada |

### Convención de ramas

| Prefijo | Uso |
|---|---|
| `feat/` | Funcionalidad nueva |
| `fix/` | Corrección de un defecto |
| `refactor/` | Cambio interno sin alterar el comportamiento |
| `docs/` | Documentación |

## Scripts

### Backend

| Comando | Descripción |
|---|---|
| `npm run start:dev` | Servidor en modo desarrollo |
| `npm run build` | Compilación para producción |
| `npm run typecheck` | Verificación de tipos |
| `npm run db:init` | Aplica `database/schema.sql` a la base |
| `npm run seed:admin` | Crea el administrador inicial |

### Frontend

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor en modo desarrollo |
| `npm run build` | Compilación para producción |
| `npm run start` | Servidor de producción |
| `npm run lint` | Análisis estático |
