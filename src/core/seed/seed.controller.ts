import { Controller, Get, UseGuards } from '@nestjs/common';
import { SeedService } from './seed.service';
import { RoleProtected } from '../../core/auth/decorators';
import { SeedAccessGuard } from './guards/seed-access.guard';
import { ValidRoles } from 'src/common/interface';
import { ApiTags } from '@nestjs/swagger';

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
  @RoleProtected(ValidRoles.admin)
  @UseGuards(SeedAccessGuard)
  executeSeed() {
    return this.seedService.runSeed();
  }
}
