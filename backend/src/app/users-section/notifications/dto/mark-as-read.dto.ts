import { IsArray, ArrayMinSize } from 'class-validator';

export class MarkAsReadDto {
  ids!: string[];
}

