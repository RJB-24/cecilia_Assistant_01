
import { toast } from "sonner";
import { VoiceRecordingOptions } from "./types";

export class VoiceRecordingService {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: BlobPart[] = [];
  private isRecording = false;
  private recordingStream: MediaStream | null = null;
  
  /**
   * Start recording audio for note-taking
   */
  async startRecordingForNotes(): Promise<MediaStream> {
    if (this.isRecording) {
      throw new Error('Already recording');
    }
    
    try {
      // Request audio permission
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Create a new MediaRecorder
      this.mediaRecorder = new MediaRecorder(stream);
      this.audioChunks = [];
      this.recordingStream = stream;
      
      // Listen for dataavailable event to collect audio chunks
      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };
      
      // Start recording
      this.mediaRecorder.start(1000); // Collect data in 1-second chunks
      this.isRecording = true;
      
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
    if (!this.isRecording || !this.mediaRecorder) {
      throw new Error('Not currently recording');
    }
    
    return new Promise((resolve, reject) => {
      // Set up the onstop handler before stopping
      this.mediaRecorder!.onstop = async () => {
        try {
          // Create a blob from the audio chunks
          const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
          
          // In a real implementation, this would send the audio to Groq for transcription and note generation
          // For now, we'll simulate this process
          console.log('Processing audio for notes, size:', audioBlob.size);
          
          // Simulate note processing
          toast.success(`Generated notes for: ${title}`);
          
          const notes = {
            id: `note_${Date.now()}`,
            title,
            content: this.generateMockNotes(title),
            created: new Date().toISOString(),
            audio: URL.createObjectURL(audioBlob)
          };
          
          this.stopRecording();
          resolve(notes);
        } catch (error) {
          this.stopRecording();
          console.error('Error processing notes:', error);
          reject(error);
        }
      };
      
      // Stop the recorder - this will trigger the onstop handler
      this.mediaRecorder!.stop();
    });
  }
  
  /**
   * Stop recording and clean up resources
   */
  private stopRecording(): void {
    this.isRecording = false;
    this.audioChunks = [];
    
    // Stop all audio tracks
    if (this.recordingStream) {
      this.recordingStream.getTracks().forEach(track => track.stop());
      this.recordingStream = null;
    }
    
    this.mediaRecorder = null;
  }
  
  /**
   * Generate mock notes for demonstration purposes
   */
  private generateMockNotes(title: string): string {
    return `# Notes: ${title}\n\n## Key Points\n\n- This is a demonstration of automated note generation.\n- In a real implementation, audio would be sent to Groq for processing.\n- The generated notes would be structured and summarized.\n\n## Action Items\n\n- Implement actual transcription with Groq API\n- Add note categorization\n- Create a notes library for storage`;
  }
  
  /**
   * Check if currently recording notes
   */
  isRecordingNotes(): boolean {
    return this.isRecording;
  }
  
  /**
   * Cancel current recording
   */
  cancelRecording(): void {
    if (this.isRecording) {
      this.stopRecording();
      toast.info('Recording cancelled');
    }
  }
}

export const voiceRecordingService = new VoiceRecordingService();
export default voiceRecordingService;
