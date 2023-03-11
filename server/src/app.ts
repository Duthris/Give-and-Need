require('dotenv').config()
import express, { Application } from 'express';
import adminRoutes from './routes/admin';
import giverRoutes from './routes/giver';
import neederRoutes from './routes/needer';
import restaurantRoutes from './routes/restaurant';
import donationRoutes from './routes/donation';
import errorHandler from './middlewares/error.handler';
import { NotFoundError } from './errors/not-found-error';
import helmet from 'helmet';
import 'express-async-errors';
var cors = require('cors')

const port = process.env.PORT || 3001;
const app: Application = express();
app.use(cors())
app.use(express.json())
app.use(errorHandler);
app.use(helmet({
    contentSecurityPolicy: false,
}));
app.set("trust proxy", true);
app.use(helmet.contentSecurityPolicy());
app.use(helmet.dnsPrefetchControl());
app.use(helmet.expectCt());
app.use(helmet.frameguard());
app.use(helmet.hidePoweredBy());
app.use(helmet.hsts());
app.use(helmet.ieNoOpen());
app.use(helmet.noSniff());
app.use(helmet.permittedCrossDomainPolicies());
app.use(helmet.referrerPolicy());
app.use(helmet.xssFilter());

app.use('/admins', adminRoutes);
app.use('/givers', giverRoutes);
app.use('/needers', neederRoutes);
app.use('/restaurants', restaurantRoutes);
app.use('/donations', donationRoutes);

app.all('*', async () => {
    throw new NotFoundError();
})

app.listen(port, function () {
    console.log(`Server is listening on port ${port}!`)
})
