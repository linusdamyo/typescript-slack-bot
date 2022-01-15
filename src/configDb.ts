import { createConnection, Connection } from 'typeorm';

const dbHost: string = process.env.DB_HOST || 'localhost';
const dbPort: number = +process.env.DB_PORT || 3306;
const dbUser: string = process.env.DB_USER || 'root';
const dbPass: string = process.env.DB_PASS || 'ajdajdsiasia';
const dbName: string = process.env.DB_NAME || 'limni';
const dbLogging: boolean = process.env.DB_LOGGING === 'true';

let dbConnection: Connection = null;

export function connDb(): Promise<Connection> {
  return createConnection({
    name: 'default',
    type: 'mysql',
    host: dbHost,
    port: dbPort,
    username: dbUser,
    password: dbPass,
    database: dbName,
    entities: [
      `${__dirname}/**/*Entity.*`,
    ],
    logging: dbLogging,
    bigNumberStrings: false,
  });
}


export function configDb(): void {
  connDb().then((connection) => {
    dbConnection = connection;
    console.log('db connected.');
  }).catch((err: any) => {
    console.log('Cannot connect to database', err);
  });
}

export async function closeDb(): Promise<void> {
  if (dbConnection) await dbConnection.close();
}
