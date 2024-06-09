import { Controller, Get } from '@nestjs/common';
import { SeedService } from './seed.service';

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
  executeSeed() {
    return this.seedService.runSeed();
  }
}
