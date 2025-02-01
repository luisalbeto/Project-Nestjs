import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // Importa el guardia JWT
import { RolesGuard } from '../auth/roles.guard'; // Importa el guardia de roles
import { Roles } from '../auth/roles.decorator'; // Importa el decorador para roles

@Controller('projects')
@UseGuards(JwtAuthGuard, RolesGuard) // Protege todas las rutas con JWT y Roles Guard
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @Roles('ADMIN', 'SUPERVISOR') // Solo ADMIN y SUPERVISOR pueden crear proyectos
  async create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectsService.create(createProjectDto);
  }

  @Get()
  async findAll() {
    return this.projectsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.projectsService.findOne(Number(id));
  }

  @Put(':id')
  @Roles('SUPERVISOR') // Solo SUPERVISOR (dueño del proyecto) puede editarlo
  async update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectsService.update(Number(id), updateProjectDto);
  }

  @Delete(':id')
  @Roles('ADMIN') // Solo ADMIN puede eliminar proyectos
  async remove(@Param('id') id: string) {
    return this.projectsService.remove(Number(id));
  }
}
