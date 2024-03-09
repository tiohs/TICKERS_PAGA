import Sequelize, { Model } from 'sequelize';

class Subservices extends Model {
  static init(sequelize) {
    super.init(
      {
        service_id: Sequelize.INTEGER,
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
  static associate(models) {
    this.belongsTo(models.Services, { foreignKey: 'service_id' });
  }
}

export { Subservices };
