import { IsNotEmpty, IsString, IsEnum, IsOptional } from 'class-validator';
import { TaskPriority } from '@prisma/client';

export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  projectId: number; // ID del proyecto al que pertenece la tarea

  @IsOptional()
  assignedToId?: number; // ID del usuario asignado a la tarea

  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority; // Prioridad de la tarea
}
