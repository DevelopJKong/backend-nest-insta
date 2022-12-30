import { join } from 'path';
export const PORT = 5000;
export const CONFIG_OPTIONS = 'CONFIG_OPTIONS';
export const BACKEND_URL = `http://localhost:${PORT}`;
export const fileFolder = join(process.cwd(), `./files`);