import Sequelize, { Model } from 'sequelize';

class Tickets extends Model {
  static init(sequelize) {
    super.init(
      {
        user_id: Sequelize.INTEGER,
        service_id: Sequelize.INTEGER,
        counter_id: Sequelize.INTEGER,
        ticket_number: Sequelize.INTEGER,
        service_sub: Sequelize.INTEGER,
      },
      {
        sequelize,
      }
    );
 

    return this;
  }
  static associate(models) {
    this.belongsTo(models.Users, { foreignKey: 'user_id' });
    this.belongsTo(models.Services, { foreignKey: 'service_id' });
    this.belongsTo(models.Subservices, { foreignKey: 'service_sub' });
    this.belongsTo(models.Counters, { foreignKey: 'counter_id' });
  }
}

export { Tickets };
