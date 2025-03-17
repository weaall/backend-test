import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post()
    async create(@Body() createUserDto: CreateUserDto) {
        const user = await this.usersService.createUser(createUserDto.name, createUserDto.email, createUserDto.password);

        const { password, ...result } = user;

        const orderedResult = JSON.stringify({
            id: result.id,
            name: result.name,
            email: result.email,
            createdAt: result.createdAt,
        });

        return JSON.parse(orderedResult);
    }
}
