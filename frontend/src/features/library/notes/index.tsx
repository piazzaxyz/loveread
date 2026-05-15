import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, ChevronLeft, Bold, Italic, List, ListOrdered, Heading2, FileText, ClipboardList } from 'lucide-react'
import { BookNote, NoteType } from '@/types'
import { notesService } from '@/services/notes.service'
import { Button } from '@/components/ui/Button'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import styles from './Notes.module.css'

interface NotesPanelProps {
  userBookId: string
}

export function NotesPanel({ userBookId }: NotesPanelProps) {
  const [notes, setNotes] = useState<BookNote[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingNote, setEditingNote] = useState<BookNote | null>(null)
  const [title, setTitle] = useState('')
  const [noteType, setNoteType] = useState<NoteType>('NOTE')
  const [saving, setSaving] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: 'Escreva sua nota aqui...' }),
    ],
    content: '',
  })

  const load = async () => {
    try {
      const res = await notesService.getNotes(userBookId)
      setNotes(res.data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [userBookId])

  const openForm = (note?: BookNote) => {
    if (note) {
      setEditingNote(note)
      setTitle(note.title)
      setNoteType(note.type)
      editor?.commands.setContent(JSON.parse(note.content || '""'))
    } else {
      setEditingNote(null)
      setTitle('')
      setNoteType('NOTE')
      editor?.commands.clearContent()
    }
    setShowForm(true)
  }

  const save = async () => {
    if (!title || !editor) return
    setSaving(true)
    try {
      const content = JSON.stringify(editor.getJSON())
      if (editingNote) {
        await notesService.updateNote(editingNote.id, { title, content, type: noteType })
      } else {
        await notesService.createNote(userBookId, title, content, noteType)
      }
      setShowForm(false)
      load()
    } finally {
      setSaving(false)
    }
  }

  const remove = async (id: string) => {
    if (!confirm('Deletar esta nota?')) return
    await notesService.deleteNote(id)
    load()
  }

  const renderContent = (content: string) => {
    try {
      const parsed = JSON.parse(content)
      if (typeof parsed === 'string') return parsed
      return parsed?.content
        ?.flatMap((n: any) => n.content?.map((c: any) => c.text || '') || [''])
        .join(' ') || ''
    } catch {
      return content
    }
  }

  if (showForm) {
    return (
      <div className={styles.panel}>
        <div className={styles.formHeader}>
          <h3>{editingNote ? 'Editar Nota' : 'Nova Nota'}</h3>
          <button onClick={() => setShowForm(false)} className={styles.backBtn}>
            <ChevronLeft size={16} /> Voltar
          </button>
        </div>
        <div className={styles.formBody}>
          <input className={styles.titleInput} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Título da nota" />
          <select className={styles.typeSelect} value={noteType} onChange={(e) => setNoteType(e.target.value as NoteType)}>
            <option value="NOTE">Nota</option>
            <option value="SUMMARY">Resumo</option>
          </select>
          <div className={styles.editorWrapper}>
            <div className={styles.toolbar}>
              <button onClick={() => editor?.chain().focus().toggleBold().run()} className={editor?.isActive('bold') ? styles.active : ''}><Bold size={14} /></button>
              <button onClick={() => editor?.chain().focus().toggleItalic().run()} className={editor?.isActive('italic') ? styles.active : ''}><Italic size={14} /></button>
              <button onClick={() => editor?.chain().focus().toggleBulletList().run()} className={editor?.isActive('bulletList') ? styles.active : ''}><List size={14} /></button>
              <button onClick={() => editor?.chain().focus().toggleOrderedList().run()} className={editor?.isActive('orderedList') ? styles.active : ''}><ListOrdered size={14} /></button>
              <button onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} className={editor?.isActive('heading') ? styles.active : ''}><Heading2 size={14} /></button>
            </div>
            <EditorContent editor={editor} className={styles.editor} />
          </div>
          <div className={styles.formActions}>
            <Button variant="secondary" onClick={() => setShowForm(false)}>Cancelar</Button>
            <Button onClick={save} loading={saving}>Salvar</Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        <span>{notes.length} nota{notes.length !== 1 ? 's' : ''}</span>
        <Button size="sm" onClick={() => openForm()}>
          <Plus size={14} /> Nova nota
        </Button>
      </div>
      {loading ? (
        <div className={styles.loading}>Carregando...</div>
      ) : notes.length === 0 ? (
        <div className={styles.empty}>
          <FileText size={36} color="var(--text-muted)" strokeWidth={1} />
          <p>Nenhuma nota ainda. Adicione anotações e resumos!</p>
        </div>
      ) : (
        <div className={styles.notesList}>
          {notes.map((note) => (
            <div key={note.id} className={styles.noteItem}>
              <div className={styles.noteHeader}>
                {note.type === 'SUMMARY'
                  ? <ClipboardList size={15} color="var(--accent)" />
                  : <FileText size={15} color="var(--accent)" />}
                <h4 className={styles.noteTitle}>{note.title}</h4>
                <div className={styles.noteActions}>
                  <button onClick={() => openForm(note)} className={styles.actionBtn}><Pencil size={13} /></button>
                  <button onClick={() => remove(note.id)} className={`${styles.actionBtn} ${styles.deleteBtn}`}><Trash2 size={13} /></button>
                </div>
              </div>
              <p className={styles.notePreview}>{renderContent(note.content)}</p>
              <span className={styles.noteDate}>{new Date(note.updatedAt).toLocaleDateString('pt-BR')}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
