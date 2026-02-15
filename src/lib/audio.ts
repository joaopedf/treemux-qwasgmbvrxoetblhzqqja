export class AudioRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private stream: MediaStream | null = null;

  async startRecording(onDataAvailable: (blob: Blob) => void) {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          echoCancellation: true,
          noiseSuppression: true,
        }
      });

      this.mediaRecorder = new MediaRecorder(this.stream, {
        mimeType: 'audio/webm;codecs=opus',
      });

      this.audioChunks = [];

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
          onDataAvailable(event.data);
        }
      };

      this.mediaRecorder.start(3000); // Send chunks every 3 seconds
      return true;
    } catch (error) {
      console.error('Error starting recording:', error);
      return false;
    }
  }

  stopRecording(): Blob | null {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();

      if (this.stream) {
        this.stream.getTracks().forEach(track => track.stop());
      }

      if (this.audioChunks.length > 0) {
        return new Blob(this.audioChunks, { type: 'audio/webm' });
      }
    }
    return null;
  }

  isRecording(): boolean {
    return this.mediaRecorder?.state === 'recording';
  }
}
