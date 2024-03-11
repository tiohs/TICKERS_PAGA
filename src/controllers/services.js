import { object, string } from 'yup';
import { Services } from '../models/Services';

class ServicesController {
 async create(request, response) {
    const { name, description } = request.body;
   
    let servicesSchema = object({
      name: string().required(),
      description: string(),
    });

    const isValidationService = await servicesSchema.isValid(request.body);
    
    if(!isValidationService) {
      response.send('Erro nos dados ')
    }
    await Services.create({
      name,
      description
    })
    response.redirect('/admin/service')
  }
  async updated(request, response) {
    const { id } = request.params;
    const data = request.body;
  
    const result = await Services.update(
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
}

export { ServicesController };