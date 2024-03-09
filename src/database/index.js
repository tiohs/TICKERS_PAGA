import Sequelize from 'sequelize';
import databaseConfig from '../config/database';
import { Counters } from '../models/Counters';
import { Services } from '../models/Services';
import { Tickets } from '../models/Tickers';
import { Users } from '../models/Users';
import { History } from '../models/history'
import { Subservices } from '../models/sub_services'

const models = [Users, Services, Counters, Tickets, History, Subservices];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);
    models
      .map(model => model.init(this.connection)).map(
        (model) => model.associate && model.associate(this.connection.models)
      );
  }
}

export default new Database();
