
import React, { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Note, Trash2, Calendar, Video } from "lucide-react";
import { toast } from "sonner";
import { noteService, Note as NoteType } from "@/services/noteService";

const Notes: React.FC = () => {
  const [notes, setNotes] = useState<NoteType[]>([]);
  const [selectedNote, setSelectedNote] = useState<NoteType | null>(null);

  useEffect(() => {
    // Load notes from storage when component mounts
    noteService.loadNotesFromStorage();
    setNotes(noteService.getAllNotes());
  }, []);

  const handleDeleteNote = (id: string) => {
    if (noteService.deleteNote(id)) {
      setNotes(noteService.getAllNotes());
      
      if (selectedNote && selectedNote.id === id) {
        setSelectedNote(null);
      }
      
      toast.success("Note deleted successfully");
    } else {
      toast.error("Failed to delete note");
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-wider text-jarvis-primary jarvis-glow-text">
          Notes
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div>
            <Card className="jarvis-hologram h-full">
              <CardHeader>
                <CardTitle className="text-xl font-bold jarvis-glow-text">My Notes</CardTitle>
                <CardDescription className="text-jarvis-secondary">
                  Notes from meetings and videos
                </CardDescription>
              </CardHeader>
              <CardContent>
                {notes.length > 0 ? (
                  <div className="space-y-3">
                    {notes.map(note => (
                      <div 
                        key={note.id}
                        className={`p-3 rounded-md cursor-pointer transition-all border ${
                          selectedNote?.id === note.id 
                            ? "bg-jarvis-blue/20 border-jarvis-primary" 
                            : "bg-jarvis-dark/50 border-jarvis-border/30 hover:bg-jarvis-dark"
                        }`}
                        onClick={() => setSelectedNote(note)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            {note.source === "meeting" ? (
                              <Calendar className="w-4 h-4 text-jarvis-secondary mr-2" />
                            ) : (
                              <Video className="w-4 h-4 text-jarvis-secondary mr-2" />
                            )}
                            <span className="text-jarvis-light">{note.title}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteNote(note.id);
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-jarvis-secondary hover:text-jarvis-error" />
                          </Button>
                        </div>
                        <div className="text-xs text-jarvis-secondary mt-1">
                          {new Date(note.createdAt).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8">
                    <Note className="h-10 w-10 text-jarvis-secondary opacity-30 mb-2" />
                    <p className="text-jarvis-secondary">No notes yet</p>
                    <p className="text-xs text-jarvis-secondary mt-2">
                      Say "Take notes for my meeting" to start
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-2">
            {selectedNote ? (
              <Card className="jarvis-hologram">
                <CardHeader>
                  <CardTitle className="text-xl font-bold jarvis-glow-text">{selectedNote.title}</CardTitle>
                  <CardDescription className="text-jarvis-secondary">
                    {selectedNote.source === "meeting" ? "Meeting notes" : "Video notes"} • 
                    {new Date(selectedNote.createdAt).toLocaleString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="whitespace-pre-wrap bg-jarvis-dark/70 border border-jarvis-border/30 rounded-md p-4 text-jarvis-light">
                    {selectedNote.content}
                  </div>
                  
                  {selectedNote.tags && selectedNote.tags.length > 0 && (
                    <div className="mt-4">
                      <h3 className="text-sm font-medium text-jarvis-light mb-2">Tags</h3>
                      <div className="flex gap-2 flex-wrap">
                        {selectedNote.tags.map((tag, index) => (
                          <span 
                            key={index}
                            className="px-2 py-1 text-xs rounded-full bg-jarvis-blue/20 border border-jarvis-blue/30 text-jarvis-light"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card className="jarvis-hologram h-full flex flex-col justify-center items-center">
                <CardContent className="py-12 text-center">
                  <Note className="h-16 w-16 text-jarvis-secondary opacity-20 mb-4 mx-auto" />
                  <h3 className="text-lg font-medium text-jarvis-light">Select a note to view</h3>
                  <p className="text-jarvis-secondary mt-2 max-w-md mx-auto">
                    Your meeting and video notes will appear here. Cecilia can take notes automatically
                    during meetings and video playback.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Notes;
