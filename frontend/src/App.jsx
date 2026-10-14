import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Search,
  Bell,
  Plus,
  Files,
  HardDrive,
  FileText,
  RefreshCw,
} from 'lucide-react';

import Sidebar from './components/Sidebar.jsx';
import DocumentCard from './components/DocumentCard.jsx';
import UploadPanel from './components/UploadPanel.jsx';
import LoginPage from './components/LoginPage.jsx';
import PlansPage from './components/PlansPage.jsx';
import { getToken, logoutUser } from './services/authApi.js';
import {
  listDocuments,
  uploadDocument,
  deleteDocument,
  downloadDocument,
} from './services/api.js';
import './styles/app.css';

function Dashboard({ user, onLogout, onOpenPlans, plan }) {
  const [docs, setDocs] = useState([]);
  const [search, setSearch] = useState('');
  const [showUpload, setShowUpload] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [showUpgrade, setShowUpgrade] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      setDocs(await listDocuments(search));
    } catch (e) {
      setError(e.message + ' — make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const total = useMemo(
    () => docs.reduce((sum, d) => sum + d.size_bytes, 0),
    [docs]
  );

  const size =
    total < 1048576
      ? `${Math.round(total / 1024)} KB`
      : `${(total / 1048576).toFixed(1)} MB`;

  async function upload(f) {
    const currentDate = new Date().toISOString().slice(0, 10);
    const currentUsageKey = `pdf_vault_free_uploads_${
      user.id || user.username
    }_${currentDate}`;
    const currentDailyUploads = Number(
      localStorage.getItem(currentUsageKey) || 0
    );

    if (plan === 'free' && currentDailyUploads >= 3) {
      setShowUpgrade(true);
      return;
    }

    await uploadDocument(f);
    if (plan === 'free') {
      const nextCount = currentDailyUploads + 1;
      localStorage.setItem(currentUsageKey, String(nextCount));
    }
    setNotice('PDF uploaded successfully.');
    await refresh();
  }

  async function remove(d) {
    if (!confirm(`Delete "${d.filename}"? This cannot be undone.`)) return;

    try {
      await deleteDocument(d.id);
      setNotice('Document deleted.');
      await refresh();
    } catch (e) {
      setError(e.message);
    }
  }

  async function download(d) {
    try {
      await downloadDocument(d.id, d.filename);
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <div className="shell">
      <Sidebar />

      <main className="main">
        <header className="topbar">
          <div className="crumb">
            Workspace <span>/</span> <b>Documents</b>
          </div>

          <div className="top-actions">
            <span className="status">
              <i />
              Local workspace
            </span>

            <button className="icon-btn" aria-label="Notifications">
              <Bell />
            </button>

            <span className="user-name">{user.username}</span>
            <button className="secondary" onClick={onLogout}>
              Log out
            </button>
          </div>
        </header>

        <div className="content">
          <section className="page-head">
            <div>
              <small className="eyebrow">YOUR DIGITAL LIBRARY</small>
              <h1>
                Documents <span className="count">{docs.length}</span>
              </h1>
              <p>Everything you need, neatly organized in one place.</p>
            </div>

            <button className="primary" onClick={() => setShowUpload(true)}>
              <Plus size={18} /> Upload PDF
            </button>
          </section>

          <section className="stats">
            <div className="stat">
              <div className="stat-icon green">
                <Files />
              </div>
              <div>
                <span>Total documents</span>
                <strong>{docs.length}</strong>
                <small>PDFs in your library</small>
              </div>
            </div>

            <div className="stat">
              <div className="stat-icon sand">
                <HardDrive />
              </div>
              <div>
                <span>Storage used</span>
                <strong>{size}</strong>
                <small>Across visible documents</small>
              </div>
            </div>

            <div className="stat">
              <div className="stat-icon lilac">
                <FileText />
              </div>
              <div>
                <span>File format</span>
                <strong>PDF</strong>
                <small>Validated on upload</small>
              </div>
            </div>
          </section>

          <section className="library">
            <div className="library-head">
              <div>
                <h2>Your library</h2>
                <p>Browse, search, and manage your saved files.</p>
              </div>

              <button className="refresh" onClick={refresh}>
                <RefreshCw size={15} /> Refresh
              </button>
            </div>

            <div className="toolbar">
              <label className="search">
                <Search size={18} />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search documents by filename…"
                />
              </label>

              <span>
                {docs.length} {docs.length === 1 ? 'file' : 'files'}
              </span>
            </div>

            {notice && (
              <div className="notice">
                {notice}
                <button onClick={() => setNotice('')}>Dismiss</button>
              </div>
            )}

            {error && (
              <div className="error-banner">
                {error}
                <button onClick={refresh}>Retry</button>
              </div>
            )}

            {loading ? (
              <div className="empty">
                <div className="spinner" />
                <h3>Loading your library…</h3>
              </div>
            ) : docs.length ? (
              <div className="doc-grid">
                {docs.map((doc) => (
                  <DocumentCard
                    key={doc.id}
                    doc={doc}
                    onDownload={download}
                    onDelete={remove}
                  />
                ))}
              </div>
            ) : (
              <div className="empty">
                <div className="empty-icon">
                  <Files size={28} />
                </div>

                <h3>{search ? 'No matching documents' : 'Your library is ready'}</h3>
                <p>
                  {search
                    ? 'Try another filename or clear your search.'
                    : 'Upload your first PDF and it will appear here.'}
                </p>

                {!search && (
                  <button className="primary" onClick={() => setShowUpload(true)}>
                    <Plus size={17} /> Upload your first PDF
                  </button>
                )}
              </div>
            )}
          </section>

          <footer className="page-footer">
            PDF VAULT · A CLEARER WAY TO STORE DOCUMENTS{' '}
            <span>Built for your workflow</span>
          </footer>
        </div>
      </main>

      {showUpload && (
        <UploadPanel onClose={() => setShowUpload(false)} onUpload={upload} />
      )}

      {showUpgrade && (
        <div
          className="overlay"
          onMouseDown={(event) =>
            event.target === event.currentTarget && setShowUpgrade(false)
          }
        >
          <section className="modal upgrade-modal">
            <button
              className="icon-btn upgrade-close"
              aria-label="Close upgrade message"
              onClick={() => setShowUpgrade(false)}
            >
              ×
            </button>
            <div className="empty-icon">
              <HardDrive size={27} />
            </div>
            <h2>Upgrade to keep uploading</h2>
            <p>
              The Free plan includes 3 PDF uploads per day. Your allowance
              resets tomorrow.
            </p>
            <button
              className="primary upgrade-action"
              onClick={() => {
                setShowUpgrade(false);
                onOpenPlans();
              }}
            >
              View plans
            </button>
          </section>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [authenticated, setAuthenticated] = useState(Boolean(getToken()));
  const [showPlans, setShowPlans] = useState(false);
  const [plan, setPlan] = useState('free');

  function handleAuthenticated(nextUser) {
    setUser(nextUser);
    setAuthenticated(true);
    setPlan('free');
    setShowPlans(false);
  }

  function handleLogout() {
    logoutUser();
    setUser(null);
    setAuthenticated(false);
    setPlan('free');
    setShowPlans(false);
  }

  if (!authenticated) {
    return <LoginPage onAuthenticated={handleAuthenticated} />;
  }

  if (showPlans) {
    return (
      <PlansPage
        currentPlan={plan}
        onBack={() => setShowPlans(false)}
        onActivatePro={() => {
          setPlan('pro');
          setShowPlans(false);
        }}
      />
    );
  }

  return (
    <Dashboard
      user={user || { username: 'user' }}
      onLogout={handleLogout}
      onOpenPlans={() => setShowPlans(true)}
      plan={plan}
    />
  );
}
