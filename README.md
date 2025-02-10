# Project-Nestjs

Este proyecto utiliza **NestJS** para el backend y **React** con Vite para el frontend. A continuación, se detallan los pasos para clonar y ejecutar el proyecto en tu máquina local.

## Clonar el repositorio

Ejecuta en tu terminal:

```sh
git clone https://github.com/luisalbeto/Project-Nestjs.git
```

Luego, abre la carpeta donde se clonó el proyecto y entra en el directorio **Project-Nestjs**.

## Instalación y ejecución del Frontend

Accede al directorio del frontend:

```sh
cd Project-Nestjs/frontend/frontend
```

Instala las dependencias necesarias:

```sh
npx yarn install
```

Después, inicia el servidor de desarrollo:

```sh
npx yarn run dev
```

## Instalación y configuración del Backend

Accede al directorio del backend:

```sh
cd Project-Nestjs/backend/backend
```

Instala las dependencias ejecutando:

```sh
npm install
```

Luego, instala **Prisma** con:

```sh
npm install @prisma/client
```

A continuación, corre las migraciones de la base de datos:

```sh
npx prisma migrate dev
```

Después, genera los clientes de Prisma:

```sh
npx prisma generate
```

Antes de ejecutar el backend, es necesario crear un archivo **.env** dentro del directorio `Project-Nestjs/backend/backend` y agregar las siguientes variables de entorno:

```env
DATABASE_URL=postgresql://usuario:contraseña@localhost:5432/nombre_de_tu_db
JWT_SECRET=tu_secreto_super_seguro
```

⚠ **Reemplaza** `usuario`, `contraseña`, `localhost` y `nombre_de_tu_db` por los valores correctos de tu base de datos.

Finalmente, para iniciar el backend, ejecuta:

```sh
npm run start:dev
```

Si Prisma presenta errores, puedes ejecutar:

```sh
npx prisma db push
```

Una vez configurado todo, el **frontend** estará disponible en **http://localhost:5173** y el **backend** en **http://localhost:3000**.


