import { object, string } from 'yup';
import { Services } from '../models/Services';
import { Subservices } from '../models/sub_services';

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
}

export { ServicesSubController };