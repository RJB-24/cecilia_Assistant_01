
/**
 * Note service for automatic note-taking from videos and meetings
 * Leverages Groq AI for transcription and summarization
 */

import { groqService } from './groqService';

export interface NoteTakingOptions {
  title?: string;
  duration?: number;
  keywords?: string[];
  format?: 'bullets' | 'paragraphs' | 'outline';
  source?: 'video' | 'meeting' | 'manual';
}

export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: Date;
  source: 'video' | 'meeting' | 'manual';
  sourceDetails?: {
    url?: string;
    participants?: string[];
    duration?: number;
  };
}

class NoteService {
  private notes: Note[] = [];

  /**
   * Generate notes from audio/video content
   * Uses Groq AI to transcribe and summarize
   */
  async generateNotesFromMedia(audioBlob: Blob, options: NoteTakingOptions = {}): Promise<Note> {
    try {
      // First transcribe the audio using Groq's whisper model
      const transcript = await groqService.transcribeAudio(audioBlob);
      
      // Then generate a summary and notes using Groq's LLM
      const promptTemplate = `
        Create structured notes from this transcript of a ${options.title || 'meeting/video'}.
        ${options.keywords?.length ? 'Focus on these keywords: ' + options.keywords.join(', ') : ''}
        Format the notes as ${options.format || 'bullets'}.
        
        Transcript: 
        ${transcript}
      `;
      
      const summary = await groqService.processCommand(promptTemplate);
      
      // Create a new note
      const note: Note = {
        id: `note_${Date.now()}`,
        title: options.title || `Notes from ${new Date().toLocaleString()}`,
        content: summary,
        tags: options.keywords || [],
        createdAt: new Date(),
        source: options.source || 'video',
        sourceDetails: {
          duration: options.duration
        }
      };
      
      // Save the note
      this.notes.push(note);
      
      // Store in localStorage for persistence
      this.saveNotesToStorage();
      
      return note;
    } catch (error) {
      console.error('Error generating notes from media:', error);
      throw new Error(`Failed to generate notes: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  /**
   * Generate meeting notes from an ongoing meeting
   * Uses screen context and audio input
   */
  async generateMeetingNotes(meetingTitle: string, audioBlob: Blob): Promise<Note> {
    return this.generateNotesFromMedia(audioBlob, { 
      title: meetingTitle,
      format: 'outline',
      source: 'meeting'
    });
  }
  
  /**
   * Save notes to localStorage
   */
  private saveNotesToStorage(): void {
    try {
      localStorage.setItem('groqflow_notes', JSON.stringify(this.notes));
    } catch (error) {
      console.error('Error saving notes to storage:', error);
    }
  }
  
  /**
   * Load notes from localStorage
   */
  loadNotesFromStorage(): void {
    try {
      const storedNotes = localStorage.getItem('groqflow_notes');
      if (storedNotes) {
        this.notes = JSON.parse(storedNotes);
      }
    } catch (error) {
      console.error('Error loading notes from storage:', error);
    }
  }
  
  /**
   * Get all notes
   */
  getAllNotes(): Note[] {
    return [...this.notes];
  }
  
  /**
   * Get note by ID
   */
  getNoteById(id: string): Note | undefined {
    return this.notes.find(note => note.id === id);
  }
  
  /**
   * Delete note by ID
   */
  deleteNote(id: string): boolean {
    const initialLength = this.notes.length;
    this.notes = this.notes.filter(note => note.id !== id);
    
    if (this.notes.length !== initialLength) {
      this.saveNotesToStorage();
      return true;
    }
    
    return false;
  }
}

export const noteService = new NoteService();
export default noteService;
