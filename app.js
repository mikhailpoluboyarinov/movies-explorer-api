require('dotenv').config();
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
const { mongoUrl, port } = require('./utils/config');

const { PORT = port, MONGO_URL = mongoUrl } = process.env;

const app = express();

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));

mongoose.connect(MONGO_URL);

app.use(requestLogger);
app.use(cors());
app.use(helmet());
app.use(limiter);
app.use(require('./routes/auth'));

app.use(auth);
app.use(require('./routes/users'));
app.use(require('./routes/movies'));

app.get('/signout', (req, res) => {
  res.clearCookie('jwt').send({ message: 'Выход' });
});

app.use((req, res, next) => {
  next(new NotFoundError('Такой страницы не существует.'));
});

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listen on ${PORT} port`);
});
