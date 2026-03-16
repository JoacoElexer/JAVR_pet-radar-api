import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";


export class CreateFoundPetDto {
    @IsString()
    @IsNotEmpty()
    species: string;
    @IsString()
    @IsNotEmpty()
    breed: string;
    @IsString()
    @IsNotEmpty()
    color: string;
    @IsString()
    @IsNotEmpty()
    size: string;
    @IsString()
    @IsNotEmpty()
    description: string;
    @IsString()
    @IsOptional()
    photo_url?: string;
    @IsString()
    @IsNotEmpty()
    finder_name: string;
    @IsString()
    @IsNotEmpty()
    finder_email: string;
    @IsString()
    @IsNotEmpty()
    finder_phone: string;
    @IsString()
    @IsNotEmpty()
    address: string;
    @IsString()
    @IsNotEmpty()
    found_date: string;
    @IsNumber()
    @IsNotEmpty()
    latitude: number;
    @IsNumber()
    @IsNotEmpty()
    longitude: number;
}