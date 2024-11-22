import IcecastParser from 'icecast-parser';

export class StreamManager {
  constructor() {
    this.stream = null;
    this.config = {
      host: process.env.ICECAST_HOST,
      port: process.env.ICECAST_PORT,
      mount: process.env.ICECAST_MOUNT,
      username: process.env.ICECAST_USERNAME,
      password: process.env.ICECAST_PASSWORD
    };
  }

  async connect() {
    try {
      const url = `http://${this.config.host}:${this.config.port}/${this.config.mount}`;
      
      this.stream = new IcecastParser({
        url: url,
        keepListen: true,
        autoUpdate: true,
        headers: {
          'Authorization': 'Basic ' + Buffer.from(`${this.config.username}:${this.config.password}`).toString('base64')
        }
      });

      this.stream.on('metadata', metadata => {
        console.log('Now playing:', metadata.StreamTitle);
      });

      console.log('Connected to radio stream');
    } catch (error) {
      console.error('Failed to connect to radio stream:', error);
      throw error;
    }
  }

  async play() {
    if (this.stream) {
      await this.stream.start();
    }
  }

  stop() {
    if (this.stream) {
      this.stream.stop();
    }
  }
}