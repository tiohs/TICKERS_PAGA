import sequelize from 'sequelize';
import { Counters } from '../../models/Counters';
import { History } from '../../models/history';
import { Services } from '../../models/Services';
import { Tickets } from '../../models/Tickers';
import { Users } from '../../models/Users';
import { Op } from 'sequelize';
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns';
import { Subservices } from '../../models/sub_services';

export class AdminRenders {
  async cashier(req, res){

    const counters = await Counters.findAll();
    res.render('admin/cashier', { counters })
  }
  async index(req, res){
    const counters = await Counters.count();
    const services = await Services.count();
    const users = await Users.count();
    const history = await History.count();
    const allServices = await Services.findAll();
    const today = new Date();
   
    const ticketsDay = await History.findAll({
      attributes: [
        [sequelize.literal('DATE(created_at)'), 'day'],
        [sequelize.literal('COUNT(*)'), 'count']
      ],
      group: ['day'],
      where: {
        createdAt: {
          [Op.between]: [startOfMonth(today), endOfMonth(today)]
        }
      },
      order: [['created_at', 'DESC']],
      limit: 7
    });

   
    var ticketsMonth = await History.findAll({
      attributes: [
        [sequelize.literal('DATE_FORMAT(created_at, \'%Y-%m\')'), 'month'],
        [sequelize.literal('COUNT(*)'), 'count']
      ],
      group: ['month'],
      where: {
        createdAt: {
          [Op.between]: [startOfYear(today), endOfYear(today)]
        }
      },
      order: [['created_at', 'DESC']],
      limit: 12
    });
    
    var ticketsPorDepartamento = [];
    var ticketsPorDia = []; 

    for(var ticketDay of ticketsDay) {
      ticketsPorDia.push({ x :  new Date(ticketDay.dataValues.day), y: ticketDay.dataValues.count})
    }

    for(var service of allServices){
      var number = await History.count({
        where: { service_id : service.id }
      });


      ticketsPorDepartamento.push({ label: service.name, y: (number/history) * 100, x : number })
    }
    ticketsPorDepartamento = JSON.stringify(ticketsPorDepartamento)
    ticketsPorDia = JSON.stringify(ticketsPorDia)
    ticketsMonth = JSON.stringify(ticketsMonth)
    res.render('admin/index', { counters, services, users, history, ticketsPorDepartamento, ticketsPorDia, ticketsMonth})
  }
  async service(req, res){
    const services = await Services.findAll()
    res.render('admin/service', { services })
  }
  async employs(req, res){
    const users = await Users.findAll();

    res.render('admin/employs', { users })
  }
  async submenu(req, res){
    const { id } = req.params;
    
    const service = await Services.findByPk(id);
    console.log('############# Estou aqui ###############')
    console.log(service)
    const services = await Subservices.findAll({ where: {
      service_id: id
    }})
    res.render('admin/submenu', { services, service })
  }

}