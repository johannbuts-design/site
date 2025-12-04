import { useState, useEffect } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Plus, Pin, Trash2, Save, FileText } from 'lucide-react';
import { getNotes, saveNotes, Note } from '@/services/storage';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const Notes = () => {
  const { toast } = useToast();
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setNotes(getNotes());
  }, []);

  const createNote = () => {
    const newNote: Note = {
      id: crypto.randomUUID(),
      title: 'Nouvelle note',
      content: '',
      pinned: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updated = [newNote, ...notes];
    setNotes(updated);
    saveNotes(updated);
    setSelectedNote(newNote);
    setIsEditing(true);
  };

  const updateNote = (note: Note) => {
    const updated = notes.map(n => n.id === note.id ? { ...note, updatedAt: new Date().toISOString() } : n);
    setNotes(updated);
    saveNotes(updated);
    setSelectedNote(note);
    toast({ title: 'Note sauvegardée' });
  };

  const deleteNote = (id: string) => {
    const updated = notes.filter(n => n.id !== id);
    setNotes(updated);
    saveNotes(updated);
    if (selectedNote?.id === id) {
      setSelectedNote(null);
      setIsEditing(false);
    }
    toast({ title: 'Note supprimée' });
  };

  const togglePin = (note: Note) => {
    const updatedNote = { ...note, pinned: !note.pinned };
    updateNote(updatedNote);
    toast({ title: note.pinned ? 'Note désépinglée' : 'Note épinglée' });
  };

  const sortedNotes = [...notes].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  return (
    <PageContainer title="Notes" subtitle={`${notes.length} notes`}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[calc(100vh-200px)] md:h-[calc(100vh-250px)]">
        {/* Notes List */}
        <div className="glass-card p-4 overflow-hidden flex flex-col">
          <button 
            onClick={createNote}
            className="ios-button w-full flex items-center justify-center gap-2 mb-4"
          >
            <Plus className="w-4 h-4" />
            Nouvelle note
          </button>

          <div className="flex-1 overflow-y-auto space-y-2">
            {sortedNotes.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <FileText className="w-12 h-12 text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground">Aucune note</p>
                <p className="text-sm text-muted-foreground/70">Créez votre première note</p>
              </div>
            ) : (
              sortedNotes.map((note, i) => (
                <div 
                  key={note.id}
                  onClick={() => { setSelectedNote(note); setIsEditing(false); }}
                  className={cn(
                    'p-3 rounded-xl cursor-pointer transition-all animate-fade-in',
                    selectedNote?.id === note.id 
                      ? 'bg-primary/10 border border-primary/20' 
                      : 'bg-secondary/50 hover:bg-secondary'
                  )}
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        {note.pinned && <Pin className="w-3 h-3 text-primary" />}
                        <p className="font-medium text-foreground truncate">{note.title}</p>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{note.content || 'Pas de contenu'}</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {new Date(note.updatedAt).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Note Editor */}
        <div className="lg:col-span-2 glass-card p-5 flex flex-col">
          {selectedNote ? (
            <>
              <div className="flex items-center justify-between gap-4 mb-4">
                <input
                  type="text"
                  value={selectedNote.title}
                  onChange={(e) => setSelectedNote({ ...selectedNote, title: e.target.value })}
                  className="flex-1 text-xl font-bold bg-transparent border-none outline-none text-foreground"
                  placeholder="Titre de la note"
                />
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => togglePin(selectedNote)}
                    className={cn(
                      'p-2 rounded-xl transition-colors',
                      selectedNote.pinned ? 'bg-primary/10 text-primary' : 'hover:bg-secondary text-muted-foreground'
                    )}
                  >
                    <Pin className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => deleteNote(selectedNote.id)}
                    className="p-2 rounded-xl hover:bg-destructive/10 text-destructive transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <textarea
                value={selectedNote.content}
                onChange={(e) => setSelectedNote({ ...selectedNote, content: e.target.value })}
                className="flex-1 bg-transparent border-none outline-none resize-none text-foreground placeholder:text-muted-foreground"
                placeholder="Commencez à écrire..."
              />

              <div className="flex justify-end pt-4 border-t border-border">
                <button 
                  onClick={() => updateNote(selectedNote)}
                  className="ios-button flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Enregistrer
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <FileText className="w-16 h-16 text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground">Sélectionnez une note</p>
              <p className="text-sm text-muted-foreground/70">ou créez-en une nouvelle</p>
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
};

export default Notes;
