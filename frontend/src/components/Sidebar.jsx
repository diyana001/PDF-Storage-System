import React from 'react';
import { Files, LayoutDashboard, ShieldCheck, Settings } from 'lucide-react';

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-icon">
          <Files />
        </div>

        <div>
          <b>PDF Vault</b>
          <small>DOCUMENT WORKSPACE</small>
        </div>
      </div>

      <p className="nav-label">WORKSPACE</p>

      <div className="nav-active">
        <Files size={18} /> Documents
      </div>

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
