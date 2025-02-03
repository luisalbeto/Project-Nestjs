import { User } from '@prisma/client'; // Importa el modelo User desde Prisma
declare global {
  namespace Express {
    interface Request {
      user?: User; // Agrega la propiedad user al objeto Request
    }
  }
}