import { IsOptional, IsString, IsEnum } from 'class-validator';
import { TaskPriority, TaskStatus } from '@prisma/client'; // Asegúrate de importar ambos enums

export class UpdateTaskDto {
    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    projectId?: number; // ID del proyecto al que pertenece la tarea

    @IsOptional()
    assignedToId?: number; // ID del usuario asignado a la tarea

    @IsOptional()
    @IsEnum(TaskPriority)
    priority?: TaskPriority; // Prioridad de la tarea

    @IsOptional()
    @IsEnum(TaskStatus) // Asegúrate de que esto sea un enum correspondiente a las opciones definidas en Prisma
    status?: TaskStatus; // Estado de la tarea (PENDING, IN_PROGRESS, COMPLETED)
}
