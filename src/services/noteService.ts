
import { groqService } from './groqService';

export interface NoteGenerationOptions {
  title?: string;
  format?: 'bullet' | 'outline' | 'summary' | 'transcript';
  language?: string;
}

export interface GeneratedNote {
  id: string;
  title: string;
  content: string;
  format: string;
  createdAt: Date;
  source?: 'audio' | 'video' | 'text' | 'meeting';
  metadata?: Record<string, any>;
}

export class NoteService {
  private notes: GeneratedNote[] = [];

  /**
   * Generate notes from audio/video media using Groq's transcription and AI capabilities
   */
  async generateNotesFromMedia(
    media: Blob, 
    options: NoteGenerationOptions = {}
  ): Promise<GeneratedNote> {
    try {
      // Convert Blob to File for Groq API
      const mediaFile = new File([media], 'recording.webm', { 
        type: media.type || 'audio/webm',
        lastModified: Date.now()
      });

      // First, transcribe the audio using Groq
      const transcript = await groqService.transcribeAudio(mediaFile);
      
      // Then use Groq to generate structured notes from the transcript
      const notesPrompt = this.buildNotesPrompt(transcript, options);
      const structuredNotes = await groqService.processCommand(notesPrompt, {
        model: 'llama-3.3-70b-versatile',
        temperature: 0.3,
        max_tokens: 1000
      });

      const note: GeneratedNote = {
        id: this.generateId(),
        title: options.title || this.extractTitleFromContent(structuredNotes),
        content: structuredNotes,
        format: options.format || 'outline',
        createdAt: new Date(),
        source: 'audio',
        metadata: {
          originalTranscript: transcript,
          mediaSize: media.size,
          mediaType: media.type
        }
      };

      this.notes.push(note);
      return note;
    } catch (error) {
      console.error('Error generating notes from media:', error);
      throw new Error('Failed to generate notes from media');
    }
  }

  /**
   * Generate notes from text input
   */
  async generateNotesFromText(
    text: string,
    options: NoteGenerationOptions = {}
  ): Promise<GeneratedNote> {
    try {
      const notesPrompt = this.buildNotesPrompt(text, options);
      const structuredNotes = await groqService.processCommand(notesPrompt, {
        model: 'llama-3.3-70b-versatile',
        temperature: 0.3,
        max_tokens: 1000
      });

      const note: GeneratedNote = {
        id: this.generateId(),
        title: options.title || this.extractTitleFromContent(structuredNotes),
        content: structuredNotes,
        format: options.format || 'outline',
        createdAt: new Date(),
        source: 'text',
        metadata: {
          originalText: text
        }
      };

      this.notes.push(note);
      return note;
    } catch (error) {
      console.error('Error generating notes from text:', error);
      throw new Error('Failed to generate notes from text');
    }
  }

  private buildNotesPrompt(content: string, options: NoteGenerationOptions): string {
    const format = options.format || 'outline';
    const language = options.language || 'English';
    
    let prompt = `Please analyze the following content and create structured notes in ${language}.\n\n`;
    
    switch (format) {
      case 'bullet':
        prompt += "Format the notes as bullet points with clear hierarchy.\n";
        break;
      case 'outline':
        prompt += "Format the notes as a detailed outline with main topics and subtopics.\n";
        break;
      case 'summary':
        prompt += "Create a concise summary highlighting the key points.\n";
        break;
      case 'transcript':
        prompt += "Clean up and structure the transcript with proper formatting.\n";
        break;
    }
    
    prompt += `\nContent to analyze:\n${content}\n\n`;
    prompt += "Please provide well-structured, comprehensive notes that capture all important information.";
    
    return prompt;
  }

  private extractTitleFromContent(content: string): string {
    // Extract first line or first few words as title
    const lines = content.split('\n');
    const firstLine = lines[0]?.trim();
    
    if (firstLine && firstLine.length > 0) {
      return firstLine.length > 50 ? firstLine.substring(0, 50) + '...' : firstLine;
    }
    
    return `Notes - ${new Date().toLocaleDateString()}`;
  }

  private generateId(): string {
    return `note_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get all generated notes
   */
  getAllNotes(): GeneratedNote[] {
    return [...this.notes];
  }

  /**
   * Get a specific note by ID
   */
  getNoteById(id: string): GeneratedNote | undefined {
    return this.notes.find(note => note.id === id);
  }

  /**
   * Delete a note by ID
   */
  deleteNote(id: string): boolean {
    const index = this.notes.findIndex(note => note.id === id);
    if (index !== -1) {
      this.notes.splice(index, 1);
      return true;
    }
    return false;
  }

  /**
   * Update a note
   */
  updateNote(id: string, updates: Partial<GeneratedNote>): GeneratedNote | null {
    const index = this.notes.findIndex(note => note.id === id);
    if (index !== -1) {
      this.notes[index] = { ...this.notes[index], ...updates };
      return this.notes[index];
    }
    return null;
  }
}

export const noteService = new NoteService();
export default noteService;
