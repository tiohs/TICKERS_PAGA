import { object, string } from 'yup';
import { Users } from '../../models/Users';
class UsersController {
 async create(request, response) {
    const { name, email, bi } = request.body;
   
    let userSchema = object({
      name: string().required(),
      email: string().email(),
      bi: string().required()
    });

    const isValidationUser = await userSchema.isValid(request.body);
    
    if(!isValidationUser) {
      return response.send('Erro nos dados ');
    }
   
    await Users.create({
      name,
      email,
      bi,
      password_hash: bi
    });
    return response.redirect('/admin/employs')
  }
  async delete(request, response){
    const { id } = request.params;

    
    const user = await Users.findOne({
      where: { id }
    });

    if(user.type !== null) {
      return response.redirect('/admin/employs')
    }

    await user.destroy();

    return response.redirect('/admin/employs')
  }
}

export { UsersController };