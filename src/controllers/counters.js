import { object, string  } from 'yup';
import { Counters } from '../models/Counters';

class CountersController {
 async create(request, response) {
    const { name, description } = request.body;
   
    let countersSchema = object({
      name: string().required(),
      description: string(),
    });

    const isValidationCounters = await countersSchema.isValid(request.body);
    
    if(!isValidationCounters) {
      response.send('Erro nos dados ')
    }
    await Counters.create({
      name,
      description
    })
    response.redirect('/admin/cashier')
  }
 async delete(request, response) {
  const { id } = request.params;

  const counter = await Counters.findOne({ 
    where: { id }
  });

  await counter.destroy();
  response.redirect('/admin/cashier')
 }

}

export { CountersController };