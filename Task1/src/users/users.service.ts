import { Injectable, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) {}

    async createUser(name: string, email: string, password: string): Promise<User> {
        if (name.length < 2 || name.length > 50) {
            throw new BadRequestException('Name must be between 2 and 50 characters long');
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new BadRequestException('Invalid email format');
        }

        const existingUser = await this.usersRepository.findOne({ where: { email } });
        if (existingUser) {
            throw new ConflictException('Email already exists');
        }

        if (password.length < 8 || !/\d/.test(password) || !/[a-zA-Z]/.test(password)) {
            throw new BadRequestException('Password must be at least 8 characters long');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = this.usersRepository.create({ name, email, password: hashedPassword });
        return this.usersRepository.save(user);
    }
}
