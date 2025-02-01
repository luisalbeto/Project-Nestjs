import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Project } from '@prisma/client';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateProjectDto): Promise<Project> {
    return this.prisma.project.create({
      data,
    });
  }

  async findAll(): Promise<Project[]> {
    return this.prisma.project.findMany();
  }

  async findOne(id: number): Promise<Project | null> {
    const project = await this.prisma.project.findUnique({
      where: { id },
    });
    if (!project) {
      throw new NotFoundException('Proyecto no encontrado');
    }
    return project;
  }

  async update(id: number, data: UpdateProjectDto): Promise<Project> {
    const project = await this.findOne(id); // Verifica si el proyecto existe
    return this.prisma.project.update({
      where: { id },
      data,
    });
  }

  async remove(id: number): Promise<Project> {
    const project = await this.findOne(id); // Verifica si el proyecto existe
    return this.prisma.project.delete({
      where: { id },
    });
  }
}
