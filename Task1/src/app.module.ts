import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: process.env.DATABASE_HOST || 'db',
            port: parseInt(process.env.DATABASE_PORT, 10) || 3306,
            username: process.env.DATABASE_USER || 'user',
            password: process.env.DATABASE_PASSWORD || 'userpassword',
            database: process.env.DATABASE_NAME || 'userdb',
            autoLoadEntities: true,
            synchronize: true,
        }),
        UsersModule,
    ],
})
export class AppModule {}
