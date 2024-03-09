import { Router } from 'express';
import { AdminRenders } from './adminRenders';

const adminRenders = new AdminRenders();

const adminRoutesRender = new Router();

adminRoutesRender.get('/', adminRenders.index);
adminRoutesRender.get('/cashier', adminRenders.cashier);
adminRoutesRender.get('/employs', adminRenders.employs);
adminRoutesRender.get('/service', adminRenders.service);
adminRoutesRender.get('/submenu/:id', adminRenders.submenu);
export { adminRoutesRender };