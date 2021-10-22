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
      { user_id:userId, type },
      { is_expired: true },
    );
    let tokenEmail = await transactionManager.findOne(TokenEmail, {
      user_id:userId,
      type,
    });

    if (!tokenEmail) {
      tokenEmail = await transactionManager.create(TokenEmail, {
        user_id:userId,
        token_email: token,
        type,
        updated_at: new Date(),
        created_by_id: userId,
      });
    } else {
      if (tokenEmail.is_expired === true) {
        tokenEmail.token_email = token;
        tokenEmail.is_expired = false;
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
      user_id:userId,
      type,
    });
    if (tokenEmail) {
      if (token !== tokenEmail.token_email || tokenEmail.is_expired === true) {
        throw new InternalServerErrorException(`Đường link đã hết hạn.`);
      } else {
        tokenEmail.is_expired = true;
        await transactionManager.save(tokenEmail);
      }
    }
  }
}
