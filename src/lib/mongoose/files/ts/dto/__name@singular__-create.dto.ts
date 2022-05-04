import { IsNotEmpty, IsString } from 'class-validator';

export class <%= singular(classify(name)) %>CreateDto {
    @IsNotEmpty()
    @IsString()
    name: string;
  
    @IsNotEmpty()
    @IsString()
    description: string;  
}