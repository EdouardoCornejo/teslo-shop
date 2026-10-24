import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  AuthUserResponseDto,
  CreateUserDto,
  LoginResponseDto,
  LoginUserDto,
} from './dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser, RawHeaders } from '../../shared/decorators';
import { User } from 'src/core/auth/entities/user.entity';
import { UserRoleGuard } from 'src/core/auth/guards/user-role.guard';
import { Auth, RoleProtected } from 'src/core/auth/decorators';
import { ValidRoles } from 'src/common/interface';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ErrorResponseDto } from 'src/common/dtos/error-response.dto';

/**
 * Controller responsible for handling authentication operations.
 */
@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * createUser
   * @param createUserDto
   */
  @Post('register')
  @ApiOperation({
    summary: 'Register a new user',
    description:
      'Creates a user with the `user` role and returns it together with a JWT. The email must be unique.',
  })
  @ApiCreatedResponse({
    description: 'User created; the response includes a JWT.',
    type: AuthUserResponseDto,
  })
  @ApiBadRequestResponse({
    description:
      'Validation failed (invalid email, weak password...) or the email is already registered.',
    type: ErrorResponseDto,
  })
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.createUser(createUserDto);
  }

  /**
   * login
   * @param loginUserDto
   */
  @Post('login')
  @ApiOperation({
    summary: 'Log in',
    description:
      'Validates the credentials and returns a JWT to use as `Authorization: Bearer <token>`.',
  })
  @ApiCreatedResponse({
    description: 'User logged in successfully.',
    type: LoginResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Validation failed.',
    type: ErrorResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid credentials.',
    type: ErrorResponseDto,
  })
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('auth-status')
  @Auth()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Check auth status',
    description:
      'Returns the authenticated user and a renewed JWT. Useful to restore a session on page reload.',
  })
  @ApiOkResponse({
    description: 'The token is valid.',
    type: AuthUserResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Missing, invalid or expired token.',
    type: ErrorResponseDto,
  })
  checkAuthStatus(@GetUser() user: User) {
    return this.authService.checkAuthStatus(user);
  }

  @Get('private')
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Private route (demo)',
    description:
      'Demo route protected only by the JWT guard. Echoes the user, its email and the raw request headers.',
  })
  @ApiOkResponse({ description: 'The token is valid.' })
  @ApiUnauthorizedResponse({
    description: 'Missing, invalid or expired token.',
    type: ErrorResponseDto,
  })
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
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Super-user route (demo)',
    description:
      'Demo route using `@RoleProtected` + `UserRoleGuard`. Requires the `super-user` role.',
  })
  @ApiOkResponse({ description: 'The user has the required role.' })
  @ApiUnauthorizedResponse({
    description: 'Missing, invalid or expired token.',
    type: ErrorResponseDto,
  })
  @ApiForbiddenResponse({
    description: 'The user does not have the `super-user` role.',
    type: ErrorResponseDto,
  })
  testingPrivateRoute2(@GetUser() user: User) {
    return {
      status: true,
      user,
    };
  }

  @Get('private3')
  @Auth(ValidRoles.admin)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Admin route (demo)',
    description:
      'Demo route using the composed `@Auth(ValidRoles.admin)` decorator. Requires the `admin` role.',
  })
  @ApiOkResponse({ description: 'The user has the required role.' })
  @ApiUnauthorizedResponse({
    description: 'Missing, invalid or expired token.',
    type: ErrorResponseDto,
  })
  @ApiForbiddenResponse({
    description: 'The user does not have the `admin` role.',
    type: ErrorResponseDto,
  })
  testingPrivateRoute3(@GetUser() user: User) {
    return {
      status: true,
      user,
    };
  }
}
