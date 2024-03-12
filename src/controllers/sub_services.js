import { object, string } from 'yup';
import { Services } from '../models/Services';
import { Subservices } from '../models/sub_services';
import { Tickets } from '../models/Tickers';
import { Op } from 'sequelize';

class ServicesSubController {
 async create(request, response) {
    const { name, description, service_id } = request.body;
    console.log('---------------------------------------------------------')
   console.log(service_id)
    await Subservices.create({
      name,
      description,
      service_id
    })
    response.redirect('/admin/submenu/' + service_id)
  }
  async updated(request, response) {
    const { id } = request.params;
    const data = request.body;
  
    const result = await Subservices.update(
      data,
      {
        where: { id },
      }
    );
  
     if (result[0] == 0) {
       return response.status(404).json({ error: 'Counter not found' });
     }
  
    return response.json(result);
  }

  async index(request, response) {
    const hoje = new Date();
    const inicioDoDia = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
    const fimDoDia = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() + 1);

    const { id } = request.params;
    const qt = [];
    
    const services = await Subservices.findAll(
      {
        where: { service_id: id, status : true },
      }
    );

    
     for(let service of services) {
      const q = await Tickets.count({
        where: { 
          service_id: id,
          service_sub: service.id,
          user_id: null,
          created_at: {
            [Op.between]: [inicioDoDia, fimDoDia]
          }
        },
        include: [{
            model: Services
        }]
      })
      
        qt.push(q)
    
     }
     console.log(services, qt)
  
    return response.json({ services, qt });
  }
}

export { ServicesSubController };