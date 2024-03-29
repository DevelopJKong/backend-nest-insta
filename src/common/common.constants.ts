import { join } from 'path';
export const PORT = 8000;
export const PROD = 'production';
export const DEV = 'development';
export const CONFIG_OPTIONS = 'CONFIG_OPTIONS';
export const BACKEND_URL = `http://localhost:${PORT}`;
export const fileFolder = join(process.cwd(), `./files`);
export const PUB_SUB = 'PUB_SUB';
export const NEW_MESSAGE = 'NEW_MESSAGE';
