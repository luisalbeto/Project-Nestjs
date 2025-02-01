import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // Importa el guardia JWT
import { RolesGuard } from '../auth/roles.guard'; // Importa el guardia de roles
import { Roles } from '../auth/roles.decorator'; // Decorador para roles

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard) // Protege todas las rutas con JWT y Roles Guard
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles('ADMIN') // Solo ADMIN puede crear usuarios
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  async findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(Number(id));
  }

  @Put(':id')
  @Roles('ADMIN') // Solo ADMIN puede editar usuarios
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(Number(id), updateUserDto);
  }

  @Delete(':id')
  @Roles('ADMIN') // Solo ADMIN puede eliminar usuarios
  async remove(@Param('id') id: string) {
    return this.usersService.remove(Number(id));
  }
}
