import { Op } from "sequelize";
import { Services } from "../models/Services";
import { Subservices } from "../models/sub_services";
import { Tickets } from "../models/Tickers";
export class IndexRenders {
  async indexTela(req, res) {
    const services = await Services.findAll();
    const subservices = await Subservices.findAll();
    return res.render('index', { services, subservices });
  }
  async ticket(req, res){
    const counter = req.session.data.counter;
    const user = req.session.data.user.id;
    const services = await Services.findAll()
    const qt = [];
    const hoje = new Date();
    const inicioDoDia = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
    const fimDoDia = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() + 1);

    for(let service of services) {
      qt.push(await Tickets.count({
        where: { 
          service_id: service.id,
          user_id: null,
          created_at: {
            [Op.between]: [inicioDoDia, fimDoDia]
          }
        },
        include: [{
            model: Services
        }]
      }))
    }
    console.log(qt)
    return res.render('cashiers/index', { counter, user_id : user, services, qt });
  }

  async screencall(req, res) {
    return res.render('screencall')
  }
}