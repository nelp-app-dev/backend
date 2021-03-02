import {MSSQLConfig} from '../config/config';
const {NODE_ENV} = process.env;

export const getDatabaseName = () => MSSQLConfig.database + '_' + NODE_ENV;
