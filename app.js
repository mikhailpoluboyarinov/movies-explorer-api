const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const cors = require('cors');
const helmet = require('helmet');
const limiter = require('./middlewares/limiter');
const { errorHandler } = require('./middlewares/errorHandler');
const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const NotFoundError = require('./errors/notFoundError404');

const { PORT = 3000 } = process.env;

const app = express();

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));

mongoose.connect(process.env.NODE_ENV === 'production' ? 'mongodb://51.250.91.143:27017/moviesdb'
  : 'mongodb://localhost:27017/moviesdb', {
  useNewUrlParser: true,
}, (err) => {
  if (err) throw err;
  console.log('Connected to db.');
});

app.use(requestLogger);
app.use(cors());
app.use(helmet());
app.use(limiter);
app.use(require('./routes/auth'));

app.use(auth);
app.use(require('./routes/users'));
app.use(require('./routes/movies'));

app.use((req, res, next) => {
  next(new NotFoundError('Такой страницы не существует.'));
});

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listen on ${PORT} port`);
});
