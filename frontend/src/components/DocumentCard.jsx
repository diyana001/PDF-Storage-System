import {
  FileText,
  Download,
  Trash2,
  CalendarDays,
  HardDrive,
} from 'lucide-react';

const bytes = (n) =>
  n < 1048576 ? `${Math.round(n / 1024)} KB` : `${(n / 1048576).toFixed(1)} MB`;

export default function DocumentCard({ doc, onDownload, onDelete }) {
  return (
    <article className="doc-card">
      <div className="doc-top">
        <div className="pdf-icon">
          <FileText />
        </div>

        <span>PDF DOCUMENT</span>

        <button
          className="icon-btn delete"
          title="Delete"
          onClick={() => onDelete(doc)}
        >
          <Trash2 size={17} />
        </button>
      </div>

      <h3 title={doc.filename}>{doc.filename}</h3>

      <p className="doc-desc">PDF file stored in your workspace</p>

      <div className="doc-meta">
        <span>
          <CalendarDays size={14} />
          {new Date(doc.created_at).toLocaleDateString()}
        </span>

        <span>
          <HardDrive size={14} />
          {bytes(doc.size_bytes)}
        </span>
      </div>

      <button className="download-btn" onClick={() => onDownload(doc)}>
        <Download size={16} /> Download PDF
      </button>
    </article>
  );
}

