"use strict";

require('dotenv').config();

module.exports = {
  dialect: 'mysql',
  host: process.env.BD_HOST,
  username: process.env.BD_USER,
  password: process.env.BD_PASSWORD,
  database: process.env.BD_NAME,
  port: Number(process.env.BD_PORT),
  define: {
    timestamps: true,
    underscored: true,
    underscoredAllL: true
  }
};