import { IsNotEmpty, IsString } from 'class-validator';

export class <%= singular(classify(name)) %>UpdateDto {
    @IsNotEmpty()
    @IsString()
    name: string;
  
    @IsNotEmpty()
    @IsString()
    description: string;  
}