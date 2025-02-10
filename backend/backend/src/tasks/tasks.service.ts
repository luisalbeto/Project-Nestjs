import { Injectable, NotFoundException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task, TaskStatus } from '@prisma/client'; // 🔹 Importar TaskStatus


@Injectable()
export class TasksService {
    constructor(private prisma: PrismaService) {}

    async create(data: CreateTaskDto): Promise<Task> {
        return this.prisma.task.create({
            data: {
                title: data.title,
                description: data.description,
                project: { connect: { id: data.projectId } }, 
                assignedTo: data.assignedToId ? { connect: { id: data.assignedToId } } : undefined,
                priority: data.priority || 'MEDIUM',
                status: 'PENDING',
            },
        });
    }

    async findAll(): Promise<Task[]> {
        return this.prisma.task.findMany({
            include: {
                project: true,
                assignedTo: true
            }
        });
    }

    async findOne(id: number): Promise<Task | null> {
        const task = await this.prisma.task.findUnique({
            where: { id: Number(id) }, // 🔹 Convertir a número
            include: { assignedTo: true }
        });
    
        if (!task) {
            throw new NotFoundException('Tarea no encontrada');
        }
    
        return task;
    }
    

    async update(id: number, data: UpdateTaskDto): Promise<Task> {
        const task = await this.findOne(id);
        return this.prisma.task.update({
            where: { id },
            data: {
                title: data.title || task.title,
                description: data.description || task.description,
                priority: data.priority || task.priority,
                status: data.status || task.status,
                project: data.projectId ? { connect: { id: data.projectId } } : undefined,
                assignedTo: data.assignedToId ? { connect: { id: data.assignedToId } } : undefined,
            },
        });
    }

    async updateStatus(id: number, status: string, userId: number): Promise<Task> {
        const task = await this.findOne(id);

        if (!task) {
            throw new NotFoundException('Tarea no encontrada');
        }

        if (task.assignedToId !== userId) {
            throw new UnauthorizedException('No tienes permiso para actualizar esta tarea');
        }

        // 🔹 Validar que el estado sea parte del enum TaskStatus
        if (!Object.values(TaskStatus).includes(status as TaskStatus)) {
            throw new BadRequestException('Estado inválido');
        }

        return this.prisma.task.update({
            where: { id },
            data: { status: status as TaskStatus }, // 🔹 Convertir string a TaskStatus
        });}

    async remove(id: number): Promise<Task> {
        const task = await this.findOne(id);
        return this.prisma.task.delete({
            where: { id },
        });
    }
}
