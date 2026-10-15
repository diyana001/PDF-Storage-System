import React from 'react';
import { Files, Image, ShieldCheck, Settings } from 'lucide-react';

export default function Sidebar({ workspace, onWorkspaceChange }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-icon">
          <Files />
        </div>

        <div>
          <b>{workspace === 'images' ? 'Image Vault' : 'PDF Vault'}</b>
          <small>{workspace === 'images' ? 'IMAGE WORKSPACE' : 'DOCUMENT WORKSPACE'}</small>
        </div>
      </div>

      <p className="nav-label">WORKSPACE</p>

      <button className={workspace === 'pdfs' ? 'nav-active' : 'nav-muted'} onClick={() => onWorkspaceChange('pdfs')}>
        <Files size={18} /> Documents
      </button>
      <button className={workspace === 'images' ? 'nav-active' : 'nav-muted'} onClick={() => onWorkspaceChange('images')}>
        <Image size={18} /> Images
      </button>

      <div className="sidebar-bottom">
        <div className="secure">
          <ShieldCheck />
          <b>Your files, organized.</b>
          <p>A focused home for the documents that matter.</p>
        </div>

        <div className="nav-muted">
          <Settings size={17} /> Settings
        </div>

        <small className="version">PDF VAULT · VERSION 1.0</small>
      </div>
    </aside>
  );
}
