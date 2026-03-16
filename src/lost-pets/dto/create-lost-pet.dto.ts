import { IsString, IsEmail, IsNumber, IsOptional, IsBoolean, IsNotEmpty } from "class-validator";

export class CreateLostPetDto {
    @IsString()
    @IsNotEmpty()
    name: string;
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
    @IsOptional()
    @IsString()
    photo_url?: string;
    @IsString()
    @IsNotEmpty()
    owner_name: string;
    @IsEmail()
    @IsNotEmpty()
    owner_email: string;
    @IsString()
    @IsNotEmpty()
    owner_phone: string;
    @IsString()
    @IsNotEmpty()
    address: string;
    @IsString()
    @IsNotEmpty()
    lost_date: string;
    @IsNumber()
    @IsNotEmpty()
    latitude: number;
    @IsNumber()
    @IsNotEmpty()
    longitude: number;
}