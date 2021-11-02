import { InternalServerErrorException, Logger } from '@nestjs/common';
import { now } from 'moment';
import { CreateTokenEmailDto } from 'src/email/dto/create-token-email.dto';
import { EntityManager, EntityRepository, Repository } from 'typeorm';
// import { AddUserRoleDto } from './dto/add-user-role.dto';
import { TokenEmail } from './token-email.entity';

@EntityRepository(TokenEmail)
export class TokenEmailRepository extends Repository<TokenEmail> {
  async createTokenEmail(
    transactionManager: EntityManager,
    createTokenEmailDto: CreateTokenEmailDto,
  ) {
    const { userId, token, type } = createTokenEmailDto;
    await transactionManager.update(
      TokenEmail,
      { userId, type },
      { isExpired: true },
    );
    let tokenEmail = await transactionManager.findOne(TokenEmail, {
      userId,
      type,
    });

    if (!tokenEmail) {
      tokenEmail = await transactionManager.create(TokenEmail, {
        userId,
        tokenEmail: token,
        type,
        updatedAt: new Date(),
        createdById: userId,
      });
    } else {
      if (tokenEmail.isExpired === true) {
        tokenEmail.tokenEmail = token;
        tokenEmail.isExpired = false;
      }
    }

    try {
      await transactionManager.save(tokenEmail);
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException(`Lỗi khi tạo token email.`);
    }
  }

  async checkExpired(
    transactionManager: EntityManager,
    createTokenEmailDto: CreateTokenEmailDto,
  ) {
    const { userId, token, type } = createTokenEmailDto;
    const tokenEmail = await transactionManager.findOne(TokenEmail, {
      userId,
      type,
    });
    if (tokenEmail) {
      if (token !== tokenEmail.tokenEmail || tokenEmail.isExpired === true) {
        throw new InternalServerErrorException(`Đường link đã hết hạn.`);
      } else {
        tokenEmail.isExpired = true;
        await transactionManager.save(tokenEmail);
      }
    }
  }
}
