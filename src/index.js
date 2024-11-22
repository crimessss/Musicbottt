import { Bot } from './bot.js';
import dotenv from 'dotenv';

dotenv.config();

const bot = new Bot();
bot.connect().catch(console.error);