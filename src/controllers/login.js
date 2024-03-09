import { hash, compare } from 'bcryptjs'
import { Op } from 'sequelize';
import { Counters } from '../models/Counters';
import { Users } from '../models/Users';
class AuthControllers {
  async getLogin(req, res){
    const counters = await Counters.findAll()
    res.render('login', {counters});
  }
  
  async postCreateUser(req, res){
    const { email, password, counters = 0 } = req.body;
    const emailExist = await Users.findOne({
      where: { email }
    })

    
    if(!emailExist){
      req.flash('error', 'Invalid email or password !');
      return res.redirect('/login');
    }

    const doMatch = await compare(password, emailExist.password);

    if(!doMatch) {
      req.flash('error', 'Invalid email or password !');
      return res.redirect('/login');
    }

    if(!emailExist.type) {
      const counter = await Counters.findOne({
        where: {
          id: Number(counters)
        }
      });

      // if(!!counter.status) {
      //   return res.redirect('/login');
      // }

      await counter.update({
        status: true
      })
    }
   
    

    req.session.data = { isLoggedIn : true, counter: counters, user: emailExist };

    return res.redirect('/tickers');
  }

  async postDestroySessions(req, res) {
    var counters, counter;

    if(!req.session.data.user.type) {
      counters = req.session.data.counter;
      counter = await Counters.findOne({
        where: {
          id: Number(counters)
        }
      });
      await counter.update({
        status: false
      })
    }

    req.session.destroy(() => {
      res.redirect('/login');
    });
  }
}

export  { AuthControllers };