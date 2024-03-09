import Sequelize, { Model } from 'sequelize';

import bcrypt from 'bcryptjs';

class Services extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        description: Sequelize.TEXT,
        status: Sequelize.BOOLEAN
      },
      {
        sequelize,
      }
    );
 

    return this;
  }

}

export { Services };
