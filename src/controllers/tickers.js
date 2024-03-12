import { Op } from 'sequelize';
import { Services } from '../models/Services';
import io from '../config/socketIO';

import { Tickets } from "../models/Tickers";
import { History } from "../models/history";
import { Subservices } from '../models/sub_services';

export class TickerControllers {
  async index(request, response) {
    await io.getIO().emit('notification');
    return response.status(200);
  }
  async create(request, response) {
    var service_name = null 
    const { service_id, number_ticker_sub  } = request.body;
    console.log(service_id, number_ticker_sub)
    const hoje = new Date();
    const inicioDoDia = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
    const fimDoDia = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() + 1);
    var count_sub = null;
    
    const existTickers = await Tickets.findOne({
      where: { 
        created_at: {
          [Op.between]: [inicioDoDia, fimDoDia]
        }
    },
      limit: 1,
    });
   
    const service = await Services.findOne({
      where: {
        id: service_id
      }
    })
    
    if(number_ticker_sub) {
      var service_sub = await Subservices.findOne({
        where: {
          id: number_ticker_sub
        }
      })

      count_sub = await Tickets.count({
        where: { 
          service_id,
          user_id: null,
          service_sub: number_ticker_sub,
          created_at: {
            [Op.between]: [inicioDoDia, fimDoDia]
          }
        },
        include: [{
            model: Services
        }]
      });

      service_name = service_sub.name ? service_sub.name : null;
    }
   

    if(!service) {
      return response.status(200).json({
        error: 'Service not exist !'
      })
    }

    if(!existTickers) {
      await Tickets.truncate()
    }

    console.log('OK', number_ticker_sub == 0 ? null : number_ticker_sub)
    var result = await Tickets.count({
      where: { 
        service_id,
        service_sub: number_ticker_sub == 0 ? null : number_ticker_sub,
        created_at: {
          [Op.between]: [inicioDoDia, fimDoDia]
        }
    },
      limit: 1,
    });
    console.log('Tá bem' + result)
    
     const ticker = await Tickets.create({
       service_id,
       service_sub: number_ticker_sub == 0 ? null : number_ticker_sub,
       ticket_number: result + 1,
    });

   await History.create({
    user_id: ticker.user_id,
    service_sub: number_ticker_sub == 0 ? null : number_ticker_sub,
    service_id: ticker.service_id,
    counter_id: ticker.counter_id,
  });

   const count = await Tickets.count({
    where: { 
      service_id,
      user_id: null,
      created_at: {
        [Op.between]: [inicioDoDia, fimDoDia]
      }
    },
    include: [{
        model: Services
    }]
  });

   

    io.getIO().emit('now', {
      id: ticker.service_id,
      id_sub: ticker.service_sub,
      service_sub_id: ticker.service_sub,
      count,
      count_sub: count_sub
    });
    
   

    return response.json({
      ticker, service: service.name, service_name
    })
  }
 
  async update(request, response) {
    const { id } = request.params;
    const { user_id, counter_id  } = request.body;

    const hoje = new Date();
    const inicioDoDia = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
    const fimDoDia = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() + 1);

    const lastTickers = await Tickets.findOne({
      where: { 
        service_id: id,
        user_id: null,
        created_at: {
          [Op.between]: [inicioDoDia, fimDoDia]
        }
    },
    limit: 1,
    include: [{
        model: Services
    }]
    });
    
    console.log(lastTickers)
    if(!lastTickers) {
      return response.json({
        error: 'Error'
      })
    }
 
    await lastTickers.update({ 
      user_id,
      counter_id
    } ,{
      where: {
        id: lastTickers.id
      }
    });
    
    await io.getIO().emit('call', { lastTickers });
    
    const count = await Tickets.count({
      where: { 
        service_id: id,
        user_id: null,
        created_at: {
          [Op.between]: [inicioDoDia, fimDoDia]
        }
      },
      include: [{
          model: Services
      }]
    });

    io.getIO().emit('now', {
      id: lastTickers.service_id,
      count,
    });

    await History.create({
      user_id: lastTickers.user_id,
      service_id: lastTickers.service_id,
      counter_id: lastTickers.counter_id,
    });

     
    return response.json(
      lastTickers
    )
  }
  async updateSub(request, response) {
    const { id } = request.params;
    const { user_id, counter_id, sub_id  } = request.body;

    console.log(id, sub_id)
    const hoje = new Date();
    const inicioDoDia = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
    const fimDoDia = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() + 1);

    const lastTickers = await Tickets.findOne({
      where: { 
        service_id: id,
        user_id: null,
        service_sub: sub_id,
        created_at: {
          [Op.between]: [inicioDoDia, fimDoDia]
        }
    },
    limit: 1,
    include: [{
        model: Subservices,  
    }, {
      model: Services,
    }]
    });
    
    console.log(lastTickers)
    
    if(!lastTickers) {
      return response.json({
        error: 'Error'
      })
    }
 
    await lastTickers.update({ 
      user_id,
      counter_id
    } ,{
      where: {
        id: lastTickers.id
      }
    });
    
    await io.getIO().emit('call', { lastTickers });
    
    const count = await Tickets.count({
      where: { 
        service_id: id,
        user_id: null,
        created_at: {
          [Op.between]: [inicioDoDia, fimDoDia]
        }
      }
    });

    const count_sub = await Tickets.count({
      where: { 
        service_id: id,
        user_id: null,
        service_sub: sub_id,
        created_at: {
          [Op.between]: [inicioDoDia, fimDoDia]
        }
      }
    });

    io.getIO().emit('now', {
      id: lastTickers.service_id,
      id_sub: lastTickers.service_sub,
      count,
      count_sub
    });

  

    await History.create({
      user_id: lastTickers.user_id,
      service_id: lastTickers.service_id,
      counter_id: lastTickers.counter_id,
    });

     
    return response.json(
      lastTickers
    )
  }
}