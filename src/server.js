import 'domain';
require('./database');
const http = require('http');
import flash from 'connect-flash';
import cors from 'cors';
import { urlencoded } from 'body-parser';
import { join } from 'path';
import express from 'express';
import { routes } from './routes';
import { sessions } from './config/sessions';


const app = express();

const server = http.createServer(app);
const io = require('./config/socketIO').init(server);
const ioo = require('./config/socketIO')

const o = (msg) => {
  ioo.getIO().emit('ok', msg)
}
io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('notification', ({ actual }) => {

    o(actual);
  })
});

app.use(cors({
  origin: '*',
}));
app.use(urlencoded({ extended: false }));
app.set('view engine', 'ejs');
app.use(express.json());
app.set('views', join(__dirname, '..', 'public', 'views'));
app.use(express.static(join(__dirname, '..', 'public', 'assets')));
app.use(express.static(join(__dirname, 'tmp', 'uploads')));



app.use(sessions)
app.use(flash());
app.use((req, res, next) => {
  
  if(!req.session) {
    return req.session.on('destroy', () => {
      console.log(`Sessão expirada: ${req.session.sessionId}`);
    });
  }
 
  next();
});
app.use(routes);

const port = 3000;
server.listen(port, () => {
    console.log('listening on ' + port)
})