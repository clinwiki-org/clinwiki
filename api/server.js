import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import path from 'path';
import morgan from 'morgan';
import logger from './src/util/logger';
import fileUpload from 'express-fileupload';
import {graphqlHTTP} from 'express-graphql';
import {buildSchema} from 'graphql';
import rootResolver from './src/resolvers';
import fs from 'fs';
import dotenv from 'dotenv';
import {loadConfig} from './config';
import getAuthenticatedUser from './src/users/user.context';
import config from './config';


const DBMigrate = require('db-migrate');
const parse = require('pg-connection-string').parse;

const envPath = path.resolve(process.cwd()+'/../', '.env');
logger.info('Loading .env from '+envPath);
dotenv.config({
  path: envPath
});
loadConfig();

const app = express();
var corsOptions = {
    methods: ['GET','PUT','POST','DELETE','PATCH','OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  };
app.use(cors(corsOptions));

app.use(bodyParser.json({limit: '10mb'}));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Set up logging
app.use(morgan('dev',{ 
  stream: logger.stream,
  skip: function (req, res) {
    if ( req.originalUrl === '/api/health' ) {
        return true;
    } else {
        return false;
    }
}  
}));

//configureAuthContext(app);


// Need to do this to get real request IP from proxy
app.set('trust proxy', true);

// Enable PUG template engine
app.set("view engine","pug");
app.set('views', path.join(__dirname, '/src/views'));
app.use('/api/static', express.static(path.join(__dirname, '/src/static')));
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: config.tmpDir,
  debug:false
}));

// Construct a schema, using GraphQL schema language
logger.info('Loading schema.graphql')
let schemaFile =  fs.readFileSync('schema.graphql','utf8')
let schema = buildSchema(schemaFile);
 
const graphqlMiddleware = graphqlHTTP((req, res) => {
    console.log("graphMiddleWare called");
    return new Promise((resolve, reject) => {
      
      const next = async (data, info = {}) => {
        const user = await getAuthenticatedUser(req);
  
        /**
         * GraphQL configuration goes here
         */
        resolve({
            schema: schema,
            rootValue: rootResolver,
            graphiql: true,
            context: { user }          
        });
    };
    return next();
  });
});

app.use('/graphql',graphqlMiddleware);

//Index route
// app.get('/', (req, res) => {
//     res.send('Invalid endpoint!');
// });

// app.use(express.static(path.join(__dirname,'../front/build')));

// app.use('*', (req,res) => res.sendFile(path.resolve('front','build','index.html')));

const root = path.join(__dirname,'../front/build');
app.use(express.static(root));
// app.use('*', (req,res) => res.sendFile(path.resolve('front','build','index.html')));
// app.use((req, res, next) => {
//   res.sendFile(path.join(__dirname, "..", 'front','build','index.html'));
// });
app.get("*", (req, res) => {
  res.sendFile('index.html', { root });
})

app.use(function(error,req,res,next){
  console.log("ERROR: "+error,error.stack);
  logger.error((error.status || 500)+' - '+error.message+' - '+req.originalUrl+' - '+req.method+' - '+req.ip+' - '+error.stack,);
  res.status(500).end();
});

app.listen(config.port, () => {

  logger.info("_________ .__  .__       __      __.__ __   .__ ");
  logger.info("\\_   ___ \\|  | |__| ____/  \\    /  \\__|  | _|__|");
  logger.info("/    \\  \\/|  | |  |/    \\   \\/\\/   /  |  |/ /  |");
  logger.info("\\     \\___|  |_|  |   |  \\        /|  |    <|  |");
  logger.info(" \\______  /____/__|___|  /\\__/\\  / |__|__|_ \\__|");
  logger.info("        \\/             \\/      \\/          \\/     ");
                                                                     
  logger.info('Server started on port '+config.port);
  logger.info('on enviornment '+ config.nodeEnv);
});

const r = parse(config.postgresUrl);
console.log("PARSED OBJECT", r)
const optionsDev = {
  config: {
    env: "dev",
    dev: {
      driver: "postgress",
      user: r.user,
      password: r.password,
      host: r.host,
      database: r.database,
      port: r.port,
    }
  },
};
const options = {
  config: {
    env: "dev",
    dev: {
      driver: "postgress",
      user: r.user,
      password: r.password,
      host: r.host,
      database: r.database,
      port: r.port,
      ssl: {
        sslmode: 'require',
        rejectUnauthorized: false
      },
    }
  },
};
  var dbm = DBMigrate.getInstance(true, config.nodeEnv == 'development'? optionsDev:options)
  dbm.up()
 .then(function() {
  console.log("...") 
  return;
});