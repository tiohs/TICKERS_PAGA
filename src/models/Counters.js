
import Sequelize, { Model } from 'sequelize';

class Counters extends Model {
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

export { Counters };
