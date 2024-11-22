import { Highrise } from '@hiber/highrise-bot-sdk';
import { StreamManager } from './streamManager.js';
import { config } from './config.js';

export class Bot {
  constructor() {
    this.token = process.env.HIGHRISE_API_KEY;
    this.roomId = process.env.HIGHRISE_ROOM_ID;
    this.highrise = new Highrise();
    this.streamManager = new StreamManager();
  }

  async connect() {
    try {
      await this.highrise.connect(this.token, this.roomId);
      await this.streamManager.connect();
      console.log(`Connected to Highrise room: ${this.roomId}`);
      this.setupEventListeners();
    } catch (error) {
      console.error('Connection error:', error);
      throw error;
    }
  }

  setupEventListeners() {
    this.highrise.on('ready', () => {
      console.log('Bot is ready!');
      this.highrise.chat.send(config.messages.welcome);
    });

    this.highrise.on('chatCreate', (user, message) => {
      this.handleCommand(message, user);
    });

    this.highrise.on('error', (error) => {
      console.error('Highrise error:', error);
    });
  }

  async handleCommand(message, user) {
    if (!message.startsWith(config.commands.prefix)) return;

    const command = message.slice(1).toLowerCase().trim();

    switch (command) {
      case 'play':
        await this.streamManager.play();
        await this.highrise.chat.send('Starting music stream...');
        break;
      case 'stop':
        this.streamManager.stop();
        await this.highrise.chat.send('Stopping music stream...');
        break;
      case 'help':
        await this.highrise.chat.send(`Available commands: ${config.commands.available.map(cmd => `${config.commands.prefix}${cmd}`).join(', ')}`);
        break;
    }
  }
}