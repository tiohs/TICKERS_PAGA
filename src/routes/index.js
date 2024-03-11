import { UsersController } from '../controllers/users/users';
import { Router } from 'express';
import { adminRoutesRender } from '../controllers/users/adminRenders.routes';
import { ServicesController } from '../controllers/services';
import { CountersController } from '../controllers/counters';
import { TickerControllers } from '../controllers/tickers';
import { IndexRenders } from '../controllers/';
import { AuthControllers } from '../controllers/login';
import { interceptorLogin } from '../middlewares/is-auth';
import { interceptorAdmin } from '../middlewares/not-admin';
import { interceptorLogon } from '../middlewares/is-logon';
import { ServicesSubController } from '../controllers/sub_services';

const usersController = new UsersController();
const servicesController = new ServicesController();
const countersController = new CountersController();
const tickerControllers = new TickerControllers();
const indexRenders = new IndexRenders(); 
const authControllers = new AuthControllers();
const servicesSubController = new ServicesSubController()

const routes = new Router();
routes.post('/service/updated/:id', servicesController.updated);
routes.post('/service_sub/updated/:id', servicesSubController.updated);

routes.post('/api/ticker', tickerControllers.create);
routes.put('/api/ticker/:id', tickerControllers.update);
routes.get('/api/ticker/notification', tickerControllers.index)
routes.get('/login', interceptorLogon, authControllers.getLogin);
routes.post('/login', authControllers.postCreateUser);
routes.get('/',  indexRenders.indexTela);
routes.get('/call',  indexRenders.screencall);
routes.use(interceptorLogin);
routes.post('/users', usersController.create);
routes.get('/users/delete/:id', usersController.delete); 
routes.use('/admin', adminRoutesRender);
routes.post('/service', servicesController.create);
routes.post('/counter', countersController.create);
routes.post('/service_sub', servicesSubController.create);
routes.get('/counter/delete/:id', countersController.delete);

routes.get('/tickers', interceptorAdmin, indexRenders.ticket);
routes.get('/logout', authControllers.postDestroySessions);

export { routes };



