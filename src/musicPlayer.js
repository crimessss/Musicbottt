import { StreamManager } from './streamManager.js';

export class MusicPlayer {
  constructor() {
    this.queue = [];
    this.isPlaying = false;
    this.streamManager = new StreamManager();
  }

  async initialize() {
    try {
      console.log('Initializing music player...');
      await this.streamManager.connect();
      console.log('Music player initialized successfully');
    } catch (error) {
      console.error('Music player initialization error:', error);
      throw error;
    }
  }

  async play() {
    try {
      if (!this.streamManager.isConnected()) {
        await this.streamManager.connect();
      }
      this.streamManager.resume();
      this.isPlaying = true;
      return true;
    } catch (error) {
      console.error('Failed to play:', error);
      return false;
    }
  }

  pause() {
    if (this.isPlaying) {
      this.isPlaying = false;
      this.streamManager.pause();
    }
  }

  addToQueue(track) {
    this.queue.push(track);
  }

  skip() {
    if (this.queue.length > 0) {
      this.queue.shift();
      return this.play();
    }
    return false;
  }

  getQueue() {
    return this.queue;
  }

  cleanup() {
    this.streamManager.disconnect();
    this.isPlaying = false;
    this.queue = [];
  }
}