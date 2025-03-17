import { IsEmail, IsString, Length, Matches } from 'class-validator';

export class CreateUserDto {
    @IsString()
    @Length(2, 50, { message: 'Name must be between 2 and 50 characters long' })
    name: string;

    @IsEmail({}, { message: 'Invalid email format' })
    email: string;

    @IsString()
    @Length(8, undefined, { message: 'Password must be at least 8 characters long' })
    @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, {
        message: 'Password must include both numbers and letters',
    })
    password: string;
}
