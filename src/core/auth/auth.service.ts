import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { passwordEncrypt } from '../../common/adapters/auth/config/config.adapter';
import { LoginUserDto } from 'src/core/auth/dto';
import { JwtPayload } from '../../common/interface';

/**
 * Service responsible for handling authentication operations.
 */
@Injectable()
export class AuthService {
  /**
   * Constructor of the AuthService.
   * @param userRepository The repository of the users.
   * @param jwtService The service responsible for handling JWT operations.
   */
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly jwtService: JwtService,
  ) {}

  /**
   * createUser
   * @param createUserDto
   */
  async createUser(createUserDto: CreateUserDto) {
    try {
      const { password, ...userData } = createUserDto;

      const user = this.userRepository.create({
        ...userData,
        password: await passwordEncrypt.hash(password),
      });

      await this.userRepository.save(user);

      delete user.password;

      return {
        ...user,
        token: this.GetJwtToken({ ...user }),
      };
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  /**
   * login
   * @param loginUserDto
   */
  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;

    const user = await this.userRepository.findOne({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        fullName: true,
      },
    });

    if (!user || !passwordEncrypt.compareSync(password, user.password)) {
      throw new UnauthorizedException('Invalid credentials');
    }

    this.removePassword(user);

    return {
      email: user.email,
      token: this.GetJwtToken({ ...user }),
    };
  }

  /**
   * getUser
   * @param User
   */
  private removePassword(user: User) {
    delete user.password;
    return user;
  }

  /**
   * getJwtToken
   * @param payload
   */
  private GetJwtToken(payload: JwtPayload): string {
    const token = this.jwtService.sign(payload);
    return token;
  }

  /**
   * handleDBErrors
   * @param error
   */
  private handleDBErrors(error: any): void {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }

    throw new InternalServerErrorException(error);
  }
}
