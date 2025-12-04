import { FileText, ArrowRight, Pin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getPinnedNotes } from '@/services/storage';

export function NotesWidget() {
  const navigate = useNavigate();
  const pinnedNotes = getPinnedNotes();

  return (
    <div className="widget-card" onClick={() => navigate('/notes')}>
      <div className="flex items-start justify-between mb-4">
        <div className="widget-icon bg-gradient-notes">
          <FileText className="w-5 h-5" />
        </div>
        <Pin className="w-4 h-4 text-muted-foreground" />
      </div>

      <h3 className="font-semibold text-foreground mb-3">Notes épinglées</h3>

      {pinnedNotes.length === 0 ? (
        <p className="text-sm text-muted-foreground mb-4">
          Aucune note épinglée. Créez une note et épinglez-la pour la voir ici.
        </p>
      ) : (
        <div className="space-y-2 mb-4 max-h-32 overflow-y-auto">
          {pinnedNotes.slice(0, 3).map(note => (
            <div 
              key={note.id}
              className="p-2 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
            >
              <p className="text-sm font-medium text-foreground truncate">{note.title}</p>
              <p className="text-xs text-muted-foreground line-clamp-1">{note.content}</p>
            </div>
          ))}
        </div>
      )}

      <button className="flex items-center gap-2 text-sm text-primary font-medium hover:gap-3 transition-all">
        Toutes les notes <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}
