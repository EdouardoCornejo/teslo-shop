import { Controller, Get } from '@nestjs/common';
import { SeedService } from './seed.service';
import { Auth } from '../../core/auth/decorators';
import { ValidRoles } from 'src/common/interface';

/**
 * Controller responsible for handling the seed operations.
 */
@Controller('seed')
export class SeedController {
  /**
   * Constructor of the SeedController.
   * @param seedService The service responsible for handling the seed operations.
   */
  constructor(private readonly seedService: SeedService) {}

  /**
   * Execute the seed.
   */
  @Get()
  // @Auth(ValidRoles.admin)
  executeSeed() {
    return this.seedService.runSeed();
  }
}
