import Sequelize, { Model } from 'sequelize';

import bcrypt from 'bcryptjs';

class Users extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        bi: Sequelize.STRING,
        password: Sequelize.STRING,
        password_hash: Sequelize.VIRTUAL,
        type: Sequelize.BOOLEAN
      },
      {
        sequelize,
      }
    );
    this.addHook('beforeSave', async user => {
      if (user.password_hash) {
        user.password = await bcrypt.hash(user.password_hash, 8);
      }
    });

    return this;
  }

  checkPassword(password_hash) {
    return bcrypt.compare(password_hash, this.password);
  }
}

export { Users };
