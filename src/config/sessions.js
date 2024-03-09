import expressSession from 'express-session';
const SessionStore = require('express-session-sequelize')(expressSession.Store);

import Sequelize from 'sequelize';

const myDatabase = new Sequelize(process.env.BD_NAME, process.env.BD_USER, process.env.BD_PASSWORD, {
	host: process.env.BD_HOST,
	dialect: 'mysql',
});

const sequelizeSessionStore = new SessionStore({
	db: myDatabase,
});

export const sessions = expressSession({
  secret: 'keePitSecret,keePitSafe.',
	store: sequelizeSessionStore,
	resave: false,
	saveUninitialized: false,
	cookie: {
		maxAge: 28800000  
	}
});