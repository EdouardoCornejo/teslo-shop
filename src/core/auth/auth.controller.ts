import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser, RawHeaders } from '../../shared/decorators';
import { User } from 'src/core/auth/entities/user.entity';
import { UserRoleGuard } from 'src/core/auth/guards/user-role.guard';
import { Auth, RoleProtected } from 'src/core/auth/decorators';
import { ValidRoles } from 'src/common/interface';

/**
 * Controller responsible for handling authentication operations.
 */
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * createUser
   * @param createUserDto
   */
  @Post('register')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.createUser(createUserDto);
  }

  /**
   * login
   * @param loginUserDto
   */
  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('private')
  @UseGuards(AuthGuard())
  testingPrivateRoute(
    @GetUser() user: User,
    @GetUser('email') userItem: string,

    @RawHeaders() rawHeaders: string[],
  ) {
    console.log('🚀 ~ AuthController ~ rawHeaders:', rawHeaders);

    return {
      status: true,
      message: 'private route',
      user,
      userItem,
      rawHeaders,
    };
  }

  // @SetMetadata('roles', ['admin', 'super-user'])
  @Get('private2')
  @RoleProtected(ValidRoles.superUser)
  @UseGuards(AuthGuard(), UserRoleGuard)
  testingPrivateRoute2(@GetUser() user: User) {
    return {
      status: true,
      user,
    };
  }

  @Get('private3')
  @Auth(ValidRoles.admin)
  testingPrivateRoute3(@GetUser() user: User) {
    return {
      status: true,
      user,
    };
  }
}
