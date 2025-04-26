
import { noteService } from '../noteService';

export class VoiceRecordingService {
  private audioRecorder: MediaRecorder | null = null;
  private audioChunks: BlobPart[] = [];
  private isRecordingForNotes = false;

  /**
   * Start recording audio for note-taking
   */
  async startRecordingForNotes(): Promise<MediaStream> {
    if (this.isRecordingForNotes) {
      throw new Error('Already recording for notes');
    }
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.audioRecorder = new MediaRecorder(stream);
      this.audioChunks = [];
      
      this.audioRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };
      
      this.audioRecorder.start(1000);
      this.isRecordingForNotes = true;
      
      console.log('Started recording audio for notes');
      return stream;
    } catch (error) {
      console.error('Error starting audio recording:', error);
      throw new Error(`Failed to start recording: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Stop recording audio and process notes
   */
  async stopRecordingAndProcessNotes(title: string): Promise<any> {
    if (!this.isRecordingForNotes || !this.audioRecorder) {
      throw new Error('Not currently recording for notes');
    }
    
    return new Promise((resolve, reject) => {
      this.audioRecorder!.onstop = async () => {
        try {
          const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
          console.log('Processing audio for notes, size:', audioBlob.size);
          
          const notes = await noteService.generateNotesFromMedia(audioBlob, {
            title,
            format: 'outline'
          });
          
          this.isRecordingForNotes = false;
          this.audioChunks = [];
          this.audioRecorder = null;
          
          resolve(notes);
        } catch (error) {
          console.error('Error processing notes:', error);
          reject(error);
        }
      };
      
      this.audioRecorder!.stop();
    });
  }

  /**
   * Check if currently recording for notes
   */
  isRecordingNotes(): boolean {
    return this.isRecordingForNotes;
  }
}

export const voiceRecordingService = new VoiceRecordingService();
export default voiceRecordingService;
