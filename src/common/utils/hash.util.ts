import { InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

export const hashPwd = async (rawPwd) => {
  try {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(rawPwd, salt);
    return { hashedPassword, salt };
  } catch (error) {
      throw new InternalServerErrorException(error.message);
  }
};
