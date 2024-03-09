import { Op } from 'sequelize';
import { Services } from '../models/Services';
import io from '../config/socketIO';

import { Tickets } from "../models/Tickers";
import { History } from "../models/history";

export class TickerControllers {
  async index(request, response) {
    await io.getIO().emit('notification');
    return response.status(200);
  }
  async create(request, response) {
    const { service_id } = request.body;
    const hoje = new Date();
    const inicioDoDia = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
    const fimDoDia = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() + 1);

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

    if(!service) {
      return response.status(200).json({
        error: 'Service not exist !'
      })
    }

    if(!existTickers) {
      await Tickets.truncate()
    }
    var result = await Tickets.count({
      where: { 
        service_id,
        created_at: {
          [Op.between]: [inicioDoDia, fimDoDia]
        }
    },
      limit: 1,
    });

    
    const ticker = await Tickets.create({
      service_id,
       ticket_number: result + 1,
   });
   await History.create({
    user_id: ticker.user_id,
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
    count
  });
   

    return response.json({
      ticker, service: service.name
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
      count
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