const path = require('path')
const express = require('express');
const expressLayout = require('express-ejs-layouts');
const { appConfig, connectDatabase } = require('./config');
const initRoutes = require('./routes/index.route');
const error = require('./middleware/error.handler');

const app = express();
// config express to server static contents
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressLayout);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

initRoutes(app);

// if error is not an instanceOf APIError, convert it.
app.use(error.converter);
// catch 404 and forward to error handler
app.use(error.notFound);
// error handler, send stacktrace only during development
app.use(error.handler);

// Connect To database and start listening to server.
connectDatabase()
    .then(() => {
       const { port } = appConfig;
       app.listen(appConfig.port, () => console.log(`Server is up and running at ${port}`));
    })
    .catch((err) => {
        console.log(err.message);
    })
