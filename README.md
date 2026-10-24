# Teslo Shop API

API **REST** para una **tienda de ropa** construida con **NestJS**, **TypeORM** y **PostgreSQL**. Gestiona un catálogo de productos con imágenes, tallas, género y etiquetas; **autenticación JWT** con **control de acceso por roles**; **subida de imágenes** con Multer; un **chat en tiempo real** con **Socket.IO** autenticado por token; documentación interactiva con **Swagger** y un _seed_ que carga usuarios y más de 50 productos de ejemplo.

![Tech](https://img.shields.io/badge/NestJS-10-E0234E)
![Tech](https://img.shields.io/badge/TypeScript-5-3178C6)
![Tech](https://img.shields.io/badge/PostgreSQL-14.3-4169E1)
![Tech](https://img.shields.io/badge/TypeORM-0.3-FE0803)
![Tech](https://img.shields.io/badge/Auth-JWT%20%2B%20Passport-000000)
![Tech](https://img.shields.io/badge/Socket.IO-4-010101)
![Tech](https://img.shields.io/badge/Swagger-OpenAPI-85EA2D)
![Tech](https://img.shields.io/badge/Docker-Compose-2496ED)

---

## Tabla de contenidos

- [Teslo Shop API](#teslo-shop-api)
  - [Tabla de contenidos](#tabla-de-contenidos)
  - [Qué hace el proyecto](#qué-hace-el-proyecto)
  - [Cómo ejecutar el proyecto](#cómo-ejecutar-el-proyecto)
    - [Requisitos](#requisitos)
    - [Instalación](#instalación)
    - [Variables de entorno](#variables-de-entorno)
    - [Base de datos con Docker](#base-de-datos-con-docker)
    - [Levantar la API](#levantar-la-api)
    - [Poblar la base de datos (seed)](#poblar-la-base-de-datos-seed)
    - [Scripts disponibles](#scripts-disponibles)
  - [Endpoints](#endpoints)
    - [WebSockets](#websockets)
  - [Cómo funciona](#cómo-funciona)
    - [1. `auth`](#1-auth)
    - [2. `products`](#2-products)
    - [3. `files`](#3-files)
    - [4. `message-ws`](#4-message-ws)
    - [5. `seed`](#5-seed)
    - [6. `common` y `shared`](#6-common-y-shared)
    - [Flujo de una petición](#flujo-de-una-petición)
  - [Tecnologías](#tecnologías)
  - [Estructura del proyecto](#estructura-del-proyecto)
  - [Personalización](#personalización)
  - [Licencia](#licencia)

---

## Qué hace el proyecto

- **Registro e inicio de sesión** con contraseñas cifradas (bcrypt) y validación de complejidad (mayúscula, minúscula y número).
- **JWT** con Passport y decorador compuesto `@Auth(...roles)` que aplica autenticación y autorización por rol (`admin`, `super-user`, `user`).
- **Catálogo de productos**: crear, listar con paginación (`limit`, `offset`), buscar por **UUID, título o slug**, actualizar y eliminar.
- **Imágenes de producto** en una tabla propia (`product_images`) con borrado en cascada; la actualización reemplaza las imágenes dentro de una **transacción** (`QueryRunner`).
- **Slug automático** generado a partir del título en los _hooks_ `@BeforeInsert` / `@BeforeUpdate`.
- **Subida de imágenes** (`jpg`, `jpeg`, `png`, `gif`) con nombre UUID y descarga por nombre de archivo.
- **Chat en tiempo real** con Socket.IO: solo conecta quien envía un JWT válido, se notifica la lista de clientes conectados y se evita la sesión duplicada del mismo usuario.
- **Swagger** en `/api/docs` y documentación de código con **Compodoc**.
- **Seed** que reinicia la base de datos con usuarios y productos de ejemplo.

---

## Cómo ejecutar el proyecto

### Requisitos

- **Node.js** y **npm**
- **Docker** y **Docker Compose** (para PostgreSQL)

### Instalación

```bash
npm install
```

### Variables de entorno

Duplica la plantilla y completa los valores:

```bash
cp .env.example .env
```

```env
DB_PASSWORD=<tu_password>
DB_NAME='TesloDB'
DB_HOST='localhost'
DB_PORT=5432
DB_USER_NAME='postgres'

HOST_API='http://localhost:3000/api'
PORT=3000
NODE_ENV='development'

JWT_SECRET=<tu_secreto>
EXPIRES_JWT="1h"
```

### Base de datos con Docker

`docker-compose.yaml` levanta **PostgreSQL 14.3** en el puerto `5432` con `DB_PASSWORD` y `DB_NAME`, y persiste los datos en `./postgres`:

```bash
docker-compose up -d
```

TypeORM usa `synchronize: true`, así que las tablas se crean al arrancar.

### Levantar la API

```bash
npm run start:dev
```

- API: `http://localhost:3000/api`
- Swagger: `http://localhost:3000/api/docs`

### Poblar la base de datos (seed)

```
GET http://localhost:3000/api/seed
```

Borra productos y usuarios y crea los datos de `src/core/seed/data/seed-data.ts` (un usuario `admin`, un usuario `super-user` y el catálogo de productos). El acceso lo controla `SeedAccessGuard` (`src/core/seed/guards/seed-access.guard.ts`) según `NODE_ENV`:

- **`NODE_ENV` distinto de `production`** (desarrollo, valor por defecto): el endpoint es público, así que puedes poblar una base de datos vacía sin token; el propio seed crea el primer administrador.
- **`NODE_ENV=production`**: exige `Authorization: Bearer <token de un usuario admin>`, igual que `@Auth(ValidRoles.admin)`.

### Scripts disponibles

| Script                  | Descripción                                        |
| ----------------------- | -------------------------------------------------- |
| `npm run start`         | Arranca la aplicación                              |
| `npm run start:dev`     | Modo desarrollo con _watch_                        |
| `npm run start:debug`   | Modo depuración con _watch_                        |
| `npm run build`         | Compila a `dist/`                                  |
| `npm run start:prod`    | Ejecuta la build (`node dist/main`)                |
| `npm run lint`          | ESLint con autocorrección                          |
| `npm run format`        | Prettier sobre `src/` y `test/`                    |
| `npm run test`          | Tests unitarios (Jest)                             |
| `npm run test:e2e`      | Tests end-to-end                                   |
| `npm run test:cov`      | Cobertura de tests                                 |
| `npm run docs:serve`    | Sirve la documentación de Compodoc                 |
| `npm run docs:build`    | Genera la documentación "Teslo-Shop Documentation" |
| `npm run docs:coverage` | Comprueba cobertura de documentación (mínimo 85 %) |

---

## Endpoints

Todas las rutas llevan el prefijo global `/api`.

| Método   | Ruta                        | Descripción                                           | Acceso                                                         |
| -------- | --------------------------- | ----------------------------------------------------- | -------------------------------------------------------------- |
| `POST`   | `/auth/register`            | Registra un usuario y devuelve el usuario + `token`   | Público                                                        |
| `POST`   | `/auth/login`               | Devuelve `email` + `token`                            | Público                                                        |
| `GET`    | `/auth/auth-status`         | Revalida el token del usuario autenticado             | Autenticado                                                    |
| `GET`    | `/auth/private`             | Ruta de prueba (usuario y cabeceras crudas)           | Autenticado                                                    |
| `GET`    | `/auth/private2`            | Ruta de prueba con `@RoleProtected`                   | `super-user`                                                   |
| `GET`    | `/auth/private3`            | Ruta de prueba con `@Auth`                            | `admin`                                                        |
| `POST`   | `/products`                 | Crea un producto asociado al usuario                  | Autenticado                                                    |
| `GET`    | `/products?limit=&offset=`  | Lista productos paginados con sus URLs de imagen      | Público                                                        |
| `GET`    | `/products/:term`           | Busca por UUID, título o slug                         | Público                                                        |
| `PATCH`  | `/products/:id`             | Actualiza un producto (e imágenes)                    | `super-user`                                                   |
| `DELETE` | `/products/:id`             | Elimina un producto                                   | `super-user`                                                   |
| `POST`   | `/files/product`            | Sube una imagen (campo `file`) y devuelve `secureUrl` | Público                                                        |
| `GET`    | `/files/product/:imageName` | Devuelve una imagen subida                            | Público                                                        |
| `GET`    | `/seed`                     | Reinicia la base de datos con datos de ejemplo        | Público fuera de producción; `admin` con `NODE_ENV=production` |

Ejemplo de cuerpo para `POST /api/products`:

```json
{
  "title": "Teslo Hoodie",
  "price": 75,
  "sizes": ["S", "M", "L"],
  "gender": "unisex",
  "tags": ["hoodie"],
  "images": ["1740250-00-A_0_2000.jpg"]
}
```

### WebSockets

Servidor Socket.IO (`@WebSocketGateway({ cors: true })`) en el mismo puerto de la API. El cliente debe enviar el JWT en la cabecera de _handshake_ `authentication`.

| Evento                | Dirección          | Contenido                                   |
| --------------------- | ------------------ | ------------------------------------------- |
| `clients-updated`     | servidor → todos   | Array con los ids de los sockets conectados |
| `message-from-client` | cliente → servidor | `{ message: string }`                       |
| `message-from-server` | servidor → todos   | `{ fullName, message }`                     |

---

## Cómo funciona

`src/main.ts` crea la aplicación con `CustomLoggerService`, fija el prefijo global `api`, registra un `ValidationPipe` (`whitelist`, `forbidNonWhitelisted`), configura Swagger con `DocumentBuilder` (incluye _Bearer auth_) y escucha en `PORT` (o `3000`). `AppModule` configura `TypeOrmModule` (PostgreSQL, `autoLoadEntities`, `synchronize`), `ServeStaticModule` para la carpeta `public/` y los módulos de negocio.

### 1. `auth`

- Entidad `User` (tabla `users`): `email` único normalizado a minúsculas, `password` con `select: false`, `fullName`, `isActive` y `roles` (array, por defecto `['user']`).
- `AuthService` crea usuarios con `passwordEncrypt.hash`, valida credenciales con `compareSync` y firma tokens con `JwtService`; los duplicados (`23505`) se convierten en `BadRequestException`.
- `JwtStrategy` verifica el Bearer token con `JWT_SECRET`, busca el usuario y rechaza tokens de usuarios inexistentes o inactivos.
- `@RoleProtected(...roles)` guarda los roles en los metadatos (`META_ROLES`); `UserRoleGuard` los lee con `Reflector` y lanza `ForbiddenException` si el usuario no tiene ninguno.
- `@Auth(...roles)` combina ambos con `AuthGuard()` mediante `applyDecorators`.

### 2. `products`

- Entidades `Product` (`title` único, `price`, `description`, `slug` único, `stock`, `sizes`, `gender`, `tags`, relación con `User`) y `ProductImage` (`url`, `onDelete: 'CASCADE'`), ambas con `eager: true`.
- `ProductsService`:
  - `create` crea las `ProductImage` a partir de las URLs recibidas.
  - `findAll` pagina y aplana las imágenes a un array de URLs.
  - `findOne` usa `uuid.validate` para decidir entre buscar por id o por `UPPER(title)` / `slug` con `QueryBuilder`.
  - `update` usa `preload` y un `QueryRunner` con `startTransaction` / `commitTransaction` / `rollbackTransaction` para sustituir las imágenes.
- `CreateProductDto` valida `gender` con `@IsIn(['men', 'women', 'kid', 'unisex'])`.

### 3. `files`

- `FilesController.uploadProductImage` usa `FileInterceptor` con `diskStorage` en `./static/products`, el filtro `fileFilter` (extensiones válidas) y `fileNamer` (nombre `uuid.ext`), y devuelve `secureUrl` construida con `HOST_API`.
- `FilesService.getStaticProductImage` comprueba que el archivo exista antes de enviarlo con `res.sendFile`.

### 4. `message-ws`

- `MessageWsGateway` implementa `OnGatewayConnection` / `OnGatewayDisconnect`: verifica el token con `JwtService.verify`, registra o elimina al cliente y emite `clients-updated`.
- `MessageWsService` mantiene un mapa `socketId → { socket, user }`, desconecta una sesión previa del mismo usuario (`checkUserConnection`) y resuelve el `fullName` para los mensajes.

### 5. `seed`

`SeedController` usa `SeedAccessGuard`, que deja pasar cualquier petición fuera de producción y, con `NODE_ENV=production`, aplica la estrategia JWT y `UserRoleGuard` con el rol `admin`. `SeedService.runSeed` borra productos y usuarios, inserta los usuarios de `initialData` (contraseñas ya cifradas con bcrypt) y crea todos los productos con `ProductsService.create`, asignados al segundo usuario.

### 6. `common` y `shared`

- `BcryptDomain` (abstracta) → `BcryptAdapter`, instanciado como `passwordEncrypt` con 10 _salt rounds_.
- `PaginationDto` (`limit`, `offset` con `@Type(() => Number)`), interfaces `JwtPayload` y `ValidRoles`.
- Decoradores `@GetUser(campo?)` y `@RawHeaders()`, helpers `fileFilter` / `fileNamer` y `CustomLoggerService`.

### Flujo de una petición

```
Cliente HTTP
   │  PATCH /api/products/:id  +  Authorization: Bearer <token>
   ▼
ValidationPipe (DTOs con class-validator)
   ▼
@Auth(ValidRoles.superUser)
   ├─ AuthGuard('jwt') ──► JwtStrategy.validate() → req.user
   └─ UserRoleGuard    ──► Reflector(META_ROLES) → ¿rol válido?
   ▼
ProductsController ──► @GetUser() user
   ▼
ProductsService.update()
   ├─ preload(id, dto)
   └─ QueryRunner: delete imágenes → save producto → commit / rollback
   ▼
TypeORM ──► PostgreSQL
```

---

## Tecnologías

- **NestJS 10** — módulos, guards, decoradores personalizados, interceptores y gateways.
- **TypeORM 0.3** + **PostgreSQL** (`pg`), con transacciones mediante `QueryRunner`.
- **Passport JWT** + **@nestjs/jwt**; **bcrypt** detrás de un adaptador.
- **Socket.IO 4** (`@nestjs/websockets`, `@nestjs/platform-socket.io`).
- **Multer** (vía `@nestjs/platform-express`) para la subida de archivos; **uuid** para nombres y validación.
- **@nestjs/swagger** y **Compodoc** para documentación.
- **@nestjs/serve-static** para servir `public/`.
- **class-validator** / **class-transformer**, **Docker Compose**, **Jest**, **ESLint** y **Prettier**.

---

## Estructura del proyecto

```
teslo-shop/
├── src/
│   ├── main.ts                       # Bootstrap: prefijo /api, ValidationPipe, Swagger
│   ├── app.module.ts                 # TypeORM, ServeStatic y módulos
│   ├── common/
│   │   ├── adapters/auth/            # BcryptDomain, BcryptAdapter, passwordEncrypt
│   │   ├── config/                   # env.config.ts, joi.schema-validation.ts
│   │   ├── dtos/pagination.dto.ts
│   │   └── interface/                # JwtPayload, ValidRoles
│   ├── core/
│   │   ├── auth/                     # controller, service, entidad User, JwtStrategy,
│   │   │                             # UserRoleGuard, @Auth, @RoleProtected, DTOs
│   │   ├── products/                 # controller, service, entidades Product y ProductImage, DTOs
│   │   ├── files/                    # subida y descarga de imágenes
│   │   ├── message-ws/               # gateway y service de Socket.IO
│   │   └── seed/                     # controller, service, guards/seed-access.guard.ts y data/seed-data.ts
│   └── shared/
│       ├── config/log/               # CustomLoggerService
│       ├── decorators/               # @GetUser, @RawHeaders
│       └── helpers/                  # fileFilter, fileNamer
├── public/products/                  # Imágenes servidas como estáticos
├── static/products/                  # Destino de las imágenes subidas
├── test/                             # Tests e2e
├── docker-compose.yaml               # PostgreSQL 14.3
├── .env.example
├── nest-cli.json
├── tsconfig.json
├── tsconfig.doc.json                 # tsconfig auxiliar para la documentación (Compodoc)
└── package.json
```

---

## Personalización

| Variable       | Significado                                                                   | Valor en `.env.example`     |
| -------------- | ----------------------------------------------------------------------------- | --------------------------- |
| `DB_PASSWORD`  | Contraseña de PostgreSQL (también usada por Docker)                           | —                           |
| `DB_NAME`      | Nombre de la base de datos (también usado por Docker)                         | `TesloDB`                   |
| `DB_HOST`      | Host de PostgreSQL                                                            | `localhost`                 |
| `DB_PORT`      | Puerto de PostgreSQL                                                          | `5432`                      |
| `DB_USER_NAME` | Usuario de PostgreSQL                                                         | `postgres`                  |
| `HOST_API`     | URL base (con el prefijo `/api`) usada para construir `secureUrl` de imágenes | `http://localhost:3000/api` |
| `PORT`         | Puerto HTTP de la API (por defecto `3000`)                                    | `3000`                      |
| `NODE_ENV`     | Con `production` el seed solo lo puede ejecutar un `admin`                    | `development`               |
| `JWT_SECRET`   | Secreto para firmar y verificar tokens (HTTP y WS)                            | —                           |
| `EXPIRES_JWT`  | Caducidad del token                                                           | `1h`                        |

> `HOST_API` incluye el prefijo global `/api`, de modo que la `secureUrl` devuelta (`${HOST_API}/files/product/:imageName`) apunta a la ruta real `/api/files/product/:imageName`.

---

## Licencia

Proyecto de uso libre con fines educativos y de práctica.
