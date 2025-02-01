import { IsNotEmpty, IsString } from 'class-validator';

export class CreateProjectDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  description?: string;

  @IsNotEmpty()
  ownerId: number; // ID del usuario que es el dueño del proyecto
}
