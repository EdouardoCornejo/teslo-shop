import { Controller, Get, UseGuards } from '@nestjs/common';
import { SeedService } from './seed.service';
import { RoleProtected } from '../../core/auth/decorators';
import { SeedAccessGuard } from './guards/seed-access.guard';
import { ValidRoles } from 'src/common/interface';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ErrorResponseDto } from 'src/common/dtos/error-response.dto';

/**
 * Controller responsible for handling the seed operations.
 */
@Controller('seed')
@ApiTags('Seed')
export class SeedController {
  /**
   * Constructor of the SeedController.
   * @param seedService The service responsible for handling the seed operations.
   */
  constructor(private readonly seedService: SeedService) {}

  /**
   * Execute the seed.
   * Open outside production; admin-only when NODE_ENV is 'production'.
   */
  @Get()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Run the seed',
    description:
      'Deletes every product and user and inserts the sample data: `admin@gmail.com` (admin) and `super-user@gmail.com` (user, super-user), both with password `Abc123456`, plus the product catalog. Open outside production; with `NODE_ENV=production` it requires an `admin` token.',
  })
  @ApiOkResponse({
    description: 'Seed executed.',
    schema: { type: 'string', example: 'SEED EXECUTED' },
  })
  @ApiUnauthorizedResponse({
    description: 'Production only: missing, invalid or expired token.',
    type: ErrorResponseDto,
  })
  @ApiForbiddenResponse({
    description: 'Production only: the user does not have the `admin` role.',
    type: ErrorResponseDto,
  })
  @RoleProtected(ValidRoles.admin)
  @UseGuards(SeedAccessGuard)
  executeSeed() {
    return this.seedService.runSeed();
  }
}
