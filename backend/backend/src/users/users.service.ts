import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  // ✅ Crear un nuevo usuario con contraseña hasheada
  async create(data: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    return this.prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    });
  }

  // ✅ Obtener todos los usuarios
  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  // ✅ Buscar usuario por ID con validaciones
  async findById(id: number): Promise<User | null> {
    if (!id || isNaN(id)) {
      throw new BadRequestException('ID inválido');
    }

    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    return user;
  }

  // ✅ Buscar usuario por email
  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  // ✅ Actualizar usuario (solo campos permitidos)
  async update(id: number, data: Partial<{ password?: string; refreshToken?: string | null }>): Promise<User> {
    const updateData: any = { ...data };

    // Si se actualiza la contraseña, hashearla
    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 10);
    }

    return this.prisma.user.update({
      where: { id },
      data: updateData,
    });
  }

  // ✅ Eliminar usuario con manejo de errores
  async remove(id: number): Promise<User> {
    const user = await this.findById(id); // Asegurar que el usuario existe antes de eliminarlo
    return this.prisma.user.delete({
      where: { id: user.id },
    });
  }
}
