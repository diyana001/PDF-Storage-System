import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Search,
  Bell,
  Plus,
  Files,
  HardDrive,
  FileText,
  RefreshCw,
  FolderOpen,
  ArrowLeft,
  Trash2,
  Linkedin,
  Youtube,
  Facebook,
} from 'lucide-react';

import Sidebar from './components/Sidebar.jsx';
import DocumentCard from './components/DocumentCard.jsx';
import UploadPanel from './components/UploadPanel.jsx';
import LoginPage from './components/LoginPage.jsx';
import PlansPage from './components/PlansPage.jsx';
import ImageWorkspace from './components/ImageWorkspace.jsx';
import { getToken, logoutUser } from './services/authApi.js';
import {
  listDocuments,
  uploadDocument,
  deleteDocument,
  downloadDocument,
  listFolders,
  createFolder,
  deleteFolder,
} from './services/api.js';
import './styles/app.css';
import './styles/folders.css';
import './styles/footer.css';
import './styles/images.css';
import './styles/workspaces.css';

function Dashboard({ user, onLogout, onOpenPlans, plan, onWorkspaceChange }) {
  const [docs, setDocs] = useState([]);
  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState('');
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
      setDocs(await listDocuments(search, selectedFolder));
    } catch (e) {
      setError(e.message + ' — make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  }, [search, selectedFolder]);

  useEffect(() => {
    listFolders()
      .then(setFolders)
      .catch((e) => setError(e.message));
  }, []);

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
  const activeFolder = folders.find((folder) => folder.id === selectedFolder);
  const folderDocumentCount = (folderId) =>
    docs.filter((doc) => doc.folder_id === folderId).length;

  async function addFolder(name) {
    const folder = await createFolder(name);
    setFolders((current) =>
      [...current, folder].sort((a, b) => a.name.localeCompare(b.name))
    );
    setNotice(`Folder "${folder.name}" created.`);
    return folder;
  }

  async function removeFolder(folder) {
    if (!confirm(`Delete the "${folder.name}" folder? PDFs inside it will be kept uncategorized.`)) {
      return;
    }

    try {
      await deleteFolder(folder.id);
      setFolders((current) => current.filter((item) => item.id !== folder.id));
      if (selectedFolder === folder.id) {
        setSelectedFolder('');
        setSearch('');
      }
      setNotice(`Folder "${folder.name}" deleted.`);
      await refresh();
    } catch (e) {
      setError(e.message);
    }
  }

  async function upload(f, folderId) {
    if (!folderId) {
      throw new Error('Open a folder before uploading a PDF.');
    }

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

    await uploadDocument(f, folderId);
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
      <Sidebar workspace="pdfs" onWorkspaceChange={onWorkspaceChange} />

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

            {activeFolder ? (
              <button className="primary" onClick={() => setShowUpload(true)}>
                <Plus size={18} /> Upload PDF
              </button>
            ) : null}
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
                {activeFolder ? (
                  <button
                    className="back-to-folders"
                    onClick={() => {
                      setSelectedFolder('');
                      setSearch('');
                    }}
                  >
                    <ArrowLeft size={15} /> All folders
                  </button>
                ) : null}
                <h2>{activeFolder ? activeFolder.name : 'Your library'}</h2>
                <p>
                  {activeFolder
                    ? 'PDFs saved inside this folder.'
                    : 'Browse your folders and manage your saved files.'}
                </p>
              </div>

              <button className="refresh" onClick={refresh}>
                <RefreshCw size={15} /> Refresh
              </button>
            </div>

            {!activeFolder && (
              <div className="folders-home">
                <div className="folders-heading">
                  <div>
                    <h3>Your folders</h3>
                    <p>Open a folder to view the PDFs inside it.</p>
                  </div>
                  <button
                    className="secondary folder-create"
                    onClick={async () => {
                      const name = prompt('Folder name');
                      if (!name?.trim()) return;
                      try {
                        await addFolder(name);
                      } catch (e) {
                        setError(e.message);
                      }
                    }}
                  >
                    + New folder
                  </button>
                </div>

                {folders.length ? (
                  <div className="folder-grid">
                    {folders.map((folder) => (
                      <div
                        className="folder-card"
                        key={folder.id}
                      >
                        <button
                          className="folder-open"
                          onClick={() => {
                            setSearch('');
                            setSelectedFolder(folder.id);
                          }}
                        >
                          <FolderOpen size={25} />
                          <span>
                            <b>{folder.name}</b>
                            <small>
                              {folderDocumentCount(folder.id)}{' '}
                              {folderDocumentCount(folder.id) === 1 ? 'PDF' : 'PDFs'}
                            </small>
                          </span>
                        </button>
                        <button
                          className="folder-delete"
                          aria-label={`Delete ${folder.name} folder`}
                          title="Delete folder"
                          onClick={() => removeFolder(folder)}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="folders-empty">
                    <FolderOpen size={20} />
                    <span>No folders yet. Create one to organize your PDFs.</span>
                  </div>
                )}
              </div>
            )}

            {activeFolder ? (
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
            ) : null}

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

            {!activeFolder ? (
              <div className="empty folder-home-message">
                <div className="empty-icon">
                  <FolderOpen size={28} />
                </div>
                <h3>Choose a folder</h3>
                <p>Open a folder above to view and upload its PDFs.</p>
              </div>
            ) : loading ? (
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
                    folderName={folders.find((folder) => folder.id === doc.folder_id)?.name}
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

                {!search && activeFolder && (
                  <button className="primary" onClick={() => setShowUpload(true)}>
                    <Plus size={17} /> Upload your first PDF
                  </button>
                )}
              </div>
            )}
          </section>

          <footer className="site-footer">
            <div className="footer-main">
              <div className="footer-company">
                <h2>EgoTECH</h2>
                <p>
                  A clearer way to store, organize, and manage your digital
                  documents securely.
                </p>
              </div>

              <div className="footer-column">
                <h3>Explore</h3>
                <a href="#documents">Documents</a>
                <a href="#folders">Folders</a>
                <a href="#plans" onClick={(event) => {
                  event.preventDefault();
                  onOpenPlans();
                }}>Plans</a>
              </div>

              <div className="footer-column">
                <h3>Legal &amp; Support</h3>
                <a href="#privacy">Privacy Policy</a>
                <a href="#terms">Terms of Service</a>
                <a href="mailto:support@egotech.com">Contact Us</a>
              </div>

              <div className="footer-updates">
                <h3>Stay Updated</h3>
                <p>Subscribe for product updates and useful document tips.</p>
                <div className="footer-subscribe">
                  <input type="email" placeholder="Your email address" aria-label="Your email address" />
                  <button type="button">Subscribe</button>
                </div>
              </div>
            </div>

            <div className="footer-bottom">
              <span>© 2026 EgoTECH. All rights reserved.</span>
              <div className="footer-socials" aria-label="Social links">
                <a href="#linkedin" aria-label="LinkedIn"><Linkedin size={17} /></a>
                <a href="#youtube" aria-label="YouTube"><Youtube size={17} /></a>
                <a href="#facebook" aria-label="Facebook"><Facebook size={17} /></a>
              </div>
            </div>
          </footer>
        </div>
      </main>

      {showUpload && (
        <UploadPanel
          onClose={() => setShowUpload(false)}
          onUpload={upload}
          folders={folders}
          initialFolderId={selectedFolder}
          onCreateFolder={addFolder}
        />
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
  const [workspace, setWorkspace] = useState('pdfs');

  useEffect(() => {
    const expireSession = () => {
      logoutUser();
      setUser(null);
      setAuthenticated(false);
      setShowPlans(false);
      setWorkspace('pdfs');
    };
    window.addEventListener('auth-expired', expireSession);
    return () => window.removeEventListener('auth-expired', expireSession);
  }, []);

  function handleAuthenticated(nextUser) {
    setUser(nextUser);
    setAuthenticated(true);
    setPlan('free');
    setShowPlans(false);
    setWorkspace('pdfs');
  }

  function handleLogout() {
    logoutUser();
    setUser(null);
    setAuthenticated(false);
    setPlan('free');
    setShowPlans(false);
    setWorkspace('pdfs');
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

  if (workspace === 'images') {
    return (
      <ImageWorkspace
        user={user || { username: 'user' }}
        onLogout={handleLogout}
        onWorkspaceChange={setWorkspace}
        onOpenPlans={() => setShowPlans(true)}
        plan={plan}
      />
    );
  }

  return (
    <Dashboard
      user={user || { username: 'user' }}
      onLogout={handleLogout}
      onOpenPlans={() => setShowPlans(true)}
      plan={plan}
      onWorkspaceChange={setWorkspace}
    />
  );
}
