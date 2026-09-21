import { PartialType } from '@nestjs/mapped-types';
import { CreateCauseDto } from './create-cause.dto.js';

export class UpdateCauseDto extends PartialType(CreateCauseDto) {}
