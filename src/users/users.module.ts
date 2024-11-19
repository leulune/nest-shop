import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './users.model';
import { UsersController } from './users.controller';
import { Role } from 'src/roles/roles.model';
import { RolesModule } from 'src/roles/roles.module';
import { AuthModule } from 'src/auth/auth.module';
import { UserRoles } from 'src/roles/user-roles.model';

@Module({
  providers: [UsersService],
  exports: [UsersService, SequelizeModule.forFeature([User])],
  controllers: [UsersController],
  imports: [
    SequelizeModule.forFeature([User, Role, UserRoles]),
    RolesModule,
    forwardRef(() => AuthModule),
  ],
})
export class UsersModule {}
