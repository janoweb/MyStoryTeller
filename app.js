const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const bookRouter = require('./routes/bookRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

//  -----===== GLOBAL MIDDLEWARE FUNCTIONS  =====-----

//  -- Protecting headers with helmet  --
app.use(helmet());

// --  Using morgan in development  ---
if(process.env.NODE_ENV === 'development '){
   app.use(morgan('dev'));
}

// -- Limiting requests  ---
const limiter = rateLimit({
    max: 300,
    windowMs: 60 * 60 * 1000,
    message: 'To many requests from this IP, please try again in an hour.'
});
app.use('/api', limiter);

// -- Body parser  --
app.use(express.json( { limit: '10kb' } ));

// -- Serving statics files  --
app.use(express.static(`${__dirname}/public`));

// --  Test middleware  --
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    // console.log(req.headers);
    next();
});


// -----=====  ROUTES  =====-----   
app.use('/api/v1/books', bookRouter);
app.use('/api/v1/users', userRouter); 

//  --  Route handler for not implemented routes  --
// Using all for all methods and * for all routes.
app.all('*', (req, res, next) => {
    // passing and argument in next, express asumme it is an error and skip all steps and send it global error handlr
    next(new AppError(`Can´t find the route ${req.originalUrl} on this server :(`, 404));
});

app.use(globalErrorHandler);

module.exports = app;