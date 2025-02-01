import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Task } from '@prisma/client';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
    constructor(private prisma: PrismaService) {}

    async create(data: CreateTaskDto): Promise<Task> {
        return this.prisma.task.create({
            data: {
                title: data.title,
                description: data.description,
                project: { connect: { id: data.projectId } }, // Conecta al proyecto por ID
                assignedTo: data.assignedToId ? { connect: { id: data.assignedToId } } : undefined,
                priority: data.priority || 'MEDIUM', // Asigna una prioridad por defecto si no se proporciona
                status: 'PENDING', // Asigna un estado por defecto al crear la tarea
            },
        });
    }

    async findAll(): Promise<Task[]> {
        return this.prisma.task.findMany();
    }

    async findOne(id: number): Promise<Task | null> {
        const task = await this.prisma.task.findUnique({
            where: { id },
        });
        if (!task) {
            throw new NotFoundException('Tarea no encontrada');
        }
        return task;
    }

    async update(id: number, data: UpdateTaskDto): Promise<Task> {
        const task = await this.findOne(id); // Verifica si la tarea existe

        return this.prisma.task.update({
            where: { id },
            data: {
                title: data.title || task.title,
                description: data.description || task.description,
                priority: data.priority || task.priority,
                status: data.status || task.status, // Asegúrate de que esto sea del tipo correcto (enum)
                project: data.projectId ? { connect: { id: data.projectId } } : undefined,
                assignedTo: data.assignedToId ? { connect: { id: data.assignedToId } } : undefined,
            },
        });
    }

    async remove(id: number): Promise<Task> {
        const task = await this.findOne(id); // Verifica si la tarea existe
        return this.prisma.task.delete({
            where: { id },
        });
    }
}
