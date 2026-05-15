import { useState, useEffect, useRef } from 'react'
import { Upload, FileText, Trash2 } from 'lucide-react'
import { BookFile } from '@/types'
import { filesService } from '@/services/files.service'
import { Button } from '@/components/ui/Button'
import styles from './Files.module.css'

interface FilesPanelProps {
  userBookId: string
}

export function FilesPanel({ userBookId }: FilesPanelProps) {
  const [files, setFiles] = useState<BookFile[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const load = async () => {
    try {
      const res = await filesService.getFiles(userBookId)
      setFiles(res.data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [userBookId])

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setUploadProgress(0)
    try {
      await filesService.uploadFile(userBookId, file, setUploadProgress)
      load()
    } catch (err: any) {
      alert(err.response?.data?.message || 'Erro ao enviar arquivo')
    } finally {
      setUploading(false)
      setUploadProgress(0)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  const remove = async (id: string) => {
    if (!confirm('Deletar este arquivo?')) return
    await filesService.deleteFile(id)
    load()
  }

  const formatSize = (kb?: number) => {
    if (!kb) return ''
    return kb > 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${kb} KB`
  }

  return (
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        <span>{files.length} arquivo{files.length !== 1 ? 's' : ''}</span>
        <Button size="sm" onClick={() => inputRef.current?.click()} loading={uploading}>
          <Upload size={14} /> {uploading ? `${uploadProgress}%` : 'Upload PDF'}
        </Button>
        <input ref={inputRef} type="file" accept="application/pdf" onChange={handleUpload} style={{ display: 'none' }} />
      </div>

      {uploading && (
        <div className={styles.uploadProgress}>
          <div className={styles.progressBar} style={{ width: `${uploadProgress}%` }} />
        </div>
      )}

      {loading ? (
        <div className={styles.loading}>Carregando...</div>
      ) : files.length === 0 ? (
        <div className={styles.empty}>
          <FileText size={36} color="var(--text-muted)" strokeWidth={1} />
          <p>Nenhum arquivo ainda. Faça upload do PDF do livro!</p>
        </div>
      ) : (
        <div className={styles.filesList}>
          {files.map((file) => (
            <div key={file.id} className={styles.fileItem}>
              <FileText size={20} color="var(--accent)" />
              <div className={styles.fileInfo}>
                <a href={file.fileUrl} target="_blank" rel="noopener noreferrer" className={styles.fileName}>
                  {file.filename}
                </a>
                <span className={styles.fileMeta}>
                  {formatSize(file.fileSizeKb)} · {new Date(file.createdAt).toLocaleDateString('pt-BR')}
                </span>
              </div>
              <button className={styles.deleteBtn} onClick={() => remove(file.id)} title="Deletar">
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
