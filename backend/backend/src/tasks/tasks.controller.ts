import { Controller, Get, Post, Body, Param, Put, Delete, Patch, Request, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('tasks')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @Roles('ADMIN', 'SUPERVISOR')
  async create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }

  @Get()
  async findAll() {
    return this.tasksService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
      return this.tasksService.findOne(Number(id)); // 🔹 Convertir a número
  }
  

  @Put(':id')
  @Roles('USER', 'ADMIN', 'SUPERVISOR')
  async update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.update(Number(id), updateTaskDto);
  }

  @Patch(':id/status')
  @Roles('USER')
  async updateStatus(
      @Param('id') id: string,
      @Body() body: { status: string },
      @Request() req
  ) {
      return this.tasksService.updateStatus(Number(id), body.status, req.user.id);
  }

  @Delete(':id')
  @Roles('ADMIN')
  async remove(@Param('id') id: string) {
    return this.tasksService.remove(Number(id));
  }
}
