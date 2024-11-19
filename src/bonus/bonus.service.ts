import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Bonus } from './bonus.model';
import { User } from 'src/users/users.model';

@Injectable()
export class BonusService {
  constructor(
    @InjectModel(Bonus)
    private readonly bonusRepository: typeof Bonus,
    @InjectModel(User)
    private readonly userRepository: typeof User,
  ) {}

  async getBonuses(userId: number): Promise<Bonus[]> {
    return this.bonusRepository.findAll({ where: { userId } });
  }

  async calculateBonus(item: any): Promise<number> {
    return Math.round(item.totalPrice * 0.1);
  }

  async addBonus(userId: number, productId: number, amount: number) {
    const user = await this.userRepository.findByPk(userId);
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    const bonus = await this.bonusRepository.findOne({ where: { userId } });
    console.log(`YA TUTA Adding bonus of ${amount} to userId ${userId}`);
    if (bonus) {
      bonus.amount += amount;
      await bonus.save();
      console.log(`Updated bonus: ${bonus.amount} for userId ${userId}`);
    } else {
      await this.bonusRepository.create({ userId, productId, amount });
      console.log(`Created new bonus of ${amount} for userId ${userId}`);
    }
  }

  async useBonus(userId: number, amount: number) {
    const bonus = await this.bonusRepository.findOne({ where: { userId } });
    if (!bonus || bonus.amount < amount) {
      throw new NotFoundException('Недостаточно бонусов для списания');
    }

    // списываем бонусы
    bonus.amount -= amount;
    await bonus.save();
  }

  async clearBonuses(userId: number) {
    await this.bonusRepository.update({ amount: 0 }, { where: { userId } });
  }
}
