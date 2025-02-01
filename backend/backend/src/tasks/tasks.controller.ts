import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // Importa el guardia JWT
import { RolesGuard } from '../auth/roles.guard'; // Importa el guardia de roles
import { Roles } from '../auth/roles.decorator'; // Importa el decorador para roles

@Controller('tasks')
@UseGuards(JwtAuthGuard, RolesGuard) // Protege todas las rutas con JWT y Roles Guard
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @Roles('ADMIN', 'SUPERVISOR') // Solo ADMIN y SUPERVISOR pueden asignar tareas
  async create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }

  @Get()
  async findAll() {
    return this.tasksService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.tasksService.findOne(Number(id));
  }

  @Put(':id')
  @Roles('USER', 'ADMIN', 'SUPERVISOR') // USER puede actualizar sus propias tareas; ADMIN y SUPERVISOR pueden asignar tareas
  async update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.update(Number(id), updateTaskDto);
  }

  @Delete(':id')
  @Roles('ADMIN') // Solo ADMIN puede eliminar tareas
  async remove(@Param('id') id: string) {
    return this.tasksService.remove(Number(id));
  }
}
