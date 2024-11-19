import { Controller, Get, Param } from '@nestjs/common';
import { BonusService } from './bonus.service';

@Controller('bonus')
export class BonusController {
  constructor(private readonly bonusService: BonusService) {}

  @Get('/:userId')
  async getUserBonuses(@Param('userId') userId: number) {
    return this.bonusService.getBonuses(userId);
  }
}
