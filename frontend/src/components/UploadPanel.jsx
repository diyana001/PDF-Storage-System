import React, { useRef, useState } from 'react';
import { UploadCloud, X, FileUp } from 'lucide-react';

export default function UploadPanel({ onClose, onUpload, folders, onCreateFolder }) {
  const ref = useRef();
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [folderId, setFolderId] = useState('');
  const [newFolder, setNewFolder] = useState('');

  function choose(f) {
    setError('');

    if (!f) return;
    if (!f.name.toLowerCase().endsWith('.pdf'))
      return setError('Please choose a PDF file.');
    if (f.size > 25 * 1024 * 1024)
      return setError('Maximum file size is 25 MB.');

    setFile(f);
  }

  async function submit() {
    if (!file) return;

    setBusy(true);

    try {
      await onUpload(file, folderId);
      onClose();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      className="overlay"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <section className="modal">
        <header>
          <div>
            <small className="eyebrow">ADD TO YOUR LIBRARY</small>
            <h2>Upload a document</h2>
          </div>

          <button className="icon-btn" onClick={onClose}>
            <X />
          </button>
        </header>

        <button
          className="drop-zone"
          onClick={() => ref.current.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            choose(e.dataTransfer.files[0]);
          }}
        >
          {file ? <FileUp size={34} /> : <UploadCloud size={38} />}

          <b>{file ? file.name : 'Choose a PDF to upload'}</b>
          <span>{file ? 'Ready to upload' : 'Click to browse or drag and drop here'}</span>
          <small>PDF only · Maximum 25 MB</small>
        </button>

        <input
          ref={ref}
          hidden
          type="file"
          accept=".pdf,application/pdf"
          onChange={(e) => choose(e.target.files[0])}
        />

        <label className="folder-field">
          Folder
          <select value={folderId} onChange={(event) => setFolderId(event.target.value)}>
            <option value="">Uncategorized</option>
            {folders.map((folder) => (
              <option key={folder.id} value={folder.id}>{folder.name}</option>
            ))}
          </select>
        </label>

        <div className="new-folder-row">
          <input
            value={newFolder}
            onChange={(event) => setNewFolder(event.target.value)}
            placeholder="Create a new folder"
          />
          <button
            className="secondary"
            type="button"
            disabled={!newFolder.trim()}
            onClick={async () => {
              try {
                const folder = await onCreateFolder(newFolder);
                setFolderId(folder.id);
                setNewFolder('');
              } catch (e) {
                setError(e.message);
              }
            }}
          >
            Add folder
          </button>
        </div>

        {error && <p className="error-text">{error}</p>}

        <footer>
          <button className="secondary" onClick={onClose}>
            Cancel
          </button>

          <button className="primary" disabled={!file || busy} onClick={submit}>
            {busy ? 'Uploading…' : 'Upload document'}
          </button>
        </footer>
      </section>
    </div>
  );
}
