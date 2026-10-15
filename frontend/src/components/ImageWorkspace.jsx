import React, { useCallback, useEffect, useState } from 'react';
import {
  ArrowLeft,
  Bell,
  Files,
  FolderOpen,
  HardDrive,
  Image as ImageIcon,
  Plus,
  RefreshCw,
  Trash2,
  UploadCloud,
  X,
} from 'lucide-react';
import Sidebar from './Sidebar.jsx';
import {
  createImageCategory, deleteImage, deleteImageCategory, getImageUrl,
  listImageCategories, listImages, uploadImage,
} from '../services/imageApi.js';

export default function ImageWorkspace({
  user,
  onLogout,
  onWorkspaceChange,
  onOpenPlans,
  plan,
}) {
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState({});
  const [showUpload, setShowUpload] = useState(false);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(true);
  const [showUpgrade, setShowUpgrade] = useState(false);

  const refreshCategories = useCallback(async () => {
    setCategories(await listImageCategories());
  }, []);
  const refreshImages = useCallback(async () => {
    if (!activeCategory) return;
    setLoading(true);
    try {
      const next = await listImages(activeCategory.id, search);
      setImages(next);
      const urls = await Promise.all(next.map(async (image) => [image.id, await getImageUrl(image.id)]));
      setPreviews(Object.fromEntries(urls));
    } catch (e) {
      setError(e.message);
    } finally { setLoading(false); }
  }, [activeCategory, search]);

  useEffect(() => { refreshCategories().catch((e) => setError(e.message)).finally(() => setLoading(false)); }, [refreshCategories]);
  useEffect(() => { refreshImages(); }, [refreshImages]);

  async function addCategory() {
    const name = prompt('Image category name');
    if (!name?.trim()) return;
    try {
      const category = await createImageCategory(name);
      setCategories((current) => [...current, category].sort((a, b) => a.name.localeCompare(b.name)));
      setNotice(`Category "${category.name}" created.`);
    } catch (e) { setError(e.message); }
  }
  async function removeCategory(category) {
    if (!confirm(`Delete "${category.name}" and all images inside it?`)) return;
    try {
      await deleteImageCategory(category.id);
      setCategories((current) => current.filter((item) => item.id !== category.id));
      if (activeCategory?.id === category.id) setActiveCategory(null);
      setNotice(`Category "${category.name}" deleted.`);
    } catch (e) { setError(e.message); }
  }
  async function removeImage(image) {
    if (!confirm(`Delete "${image.filename}"?`)) return;
    try {
      await deleteImage(image.id);
      URL.revokeObjectURL(previews[image.id]);
      await refreshImages();
    } catch (e) { setError(e.message); }
  }
  async function submitImage(event) {
    event.preventDefault();
    const file = event.currentTarget.elements.image.files[0];
    if (!file || !activeCategory) return;
    const currentDate = new Date().toISOString().slice(0, 10);
    const usageKey = `pdf_vault_free_image_uploads_${user.id || user.username}_${currentDate}`;
    const currentUploads = Number(localStorage.getItem(usageKey) || 0);
    if (plan === 'free' && currentUploads >= 5) {
      setShowUpload(false);
      setShowUpgrade(true);
      return;
    }
    try {
      await uploadImage(file, activeCategory.id);
      if (plan === 'free') {
        localStorage.setItem(usageKey, String(currentUploads + 1));
      }
      setShowUpload(false);
      setNotice('Image uploaded successfully.');
      await refreshImages();
    } catch (e) { setError(e.message); }
  }

  return <div className="shell">
    <Sidebar workspace="images" onWorkspaceChange={onWorkspaceChange} />
    <main className="main">
      <header className="topbar">
        <div className="crumb">Workspace <span>/</span> <b>Images</b></div>
        <div className="top-actions">
          <span className="status"><i /> Local workspace</span>
          <button className="icon-btn" aria-label="Notifications"><Bell /></button>
          <span className="user-name">{user.username}</span>
          <button className="secondary" onClick={onLogout}>Log out</button>
        </div>
      </header>
      <div className="content">
        <section className="page-head">
          <div>
            <small className="eyebrow">YOUR IMAGE LIBRARY</small>
            <h1>
              {activeCategory ? activeCategory.name : 'Images'}{' '}
              <span className="count">{activeCategory ? images.length : categories.length}</span>
            </h1>
            <p>{activeCategory ? 'Images saved inside this category.' : 'Everything you need, neatly organized in one place.'}</p>
          </div>
          {activeCategory ? (
            <button className="primary" onClick={() => setShowUpload(true)}><Plus size={18} /> Upload image</button>
          ) : (
            <button className="primary" onClick={addCategory}><Plus size={18} /> New category</button>
          )}
        </section>
        <section className="stats">
          <div className="stat">
            <div className="stat-icon green"><Files /></div>
            <div><span>Total images</span><strong>{activeCategory ? images.length : categories.length}</strong><small>{activeCategory ? 'Images in this category' : 'Categories in your library'}</small></div>
          </div>
          <div className="stat">
            <div className="stat-icon sand"><HardDrive /></div>
            <div><span>Storage used</span><strong>{activeCategory ? `${(images.reduce((sum, image) => sum + image.size_bytes, 0) / 1048576).toFixed(1)} MB` : '—'}</strong><small>Across visible images</small></div>
          </div>
          <div className="stat">
            <div className="stat-icon lilac"><ImageIcon /></div>
            <div><span>File format</span><strong>IMAGE</strong><small>Validated on upload</small></div>
          </div>
        </section>
        {notice && <div className="notice">{notice}<button onClick={() => setNotice('')}>Dismiss</button></div>}
        {error && <div className="error-banner">{error}<button onClick={() => setError('')}>Dismiss</button></div>}
        <section className="library">
          <div className="library-head"><div>{activeCategory && <button className="back-to-folders" onClick={() => { setActiveCategory(null); setSearch(''); }}><ArrowLeft size={15} /> All categories</button>}<h2>{activeCategory ? activeCategory.name : 'Your library'}</h2><p>{activeCategory ? 'Browse, preview, and manage images.' : 'Browse your categories and manage your saved images.'}</p></div><button className="refresh" onClick={() => activeCategory ? refreshImages() : refreshCategories()}><RefreshCw size={15} /> Refresh</button></div>
          {!activeCategory ? <div className="folder-grid">{categories.map((category) => <div className="folder-card" key={category.id}><button className="folder-open" onClick={() => setActiveCategory(category)}><FolderOpen size={25} /><span><b>{category.name}</b><small>Open category</small></span></button><button className="folder-delete" onClick={() => removeCategory(category)} aria-label={`Delete ${category.name}`}><Trash2 size={15} /></button></div>)}{!categories.length && <div className="empty"><ImageIcon size={28} /><h3>No image categories yet</h3><p>Create a category before uploading images.</p></div>}</div> : <><div className="toolbar"><label className="search"><ImageIcon size={18} /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search images by filename…" /></label><span>{images.length} {images.length === 1 ? 'image' : 'images'}</span></div>{loading ? <div className="empty">Loading images…</div> : <div className="image-grid">{images.map((image) => <article className="image-card" key={image.id}><img src={previews[image.id]} alt={image.filename} /><div><b title={image.filename}>{image.filename}</b><button className="icon-btn delete" onClick={() => removeImage(image)}><Trash2 size={16} /></button></div></article>)}{!images.length && <div className="empty"><ImageIcon size={28} /><h3>No images in this category</h3><p>Upload an image to this category.</p></div>}</div>}</>}
        </section>
      </div>
    </main>
    {showUpload && <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && setShowUpload(false)}><form className="modal" onSubmit={submitImage}><header><div><small className="eyebrow">ADD TO CATEGORY</small><h2>Upload an image</h2></div><button type="button" className="icon-btn" onClick={() => setShowUpload(false)}><X /></button></header><label className="drop-zone"><UploadCloud size={38} /><b>Choose an image</b><span>JPG, PNG, GIF, WEBP, or BMP · Maximum 25 MB</span><input name="image" type="file" accept="image/jpeg,image/png,image/gif,image/webp,image/bmp" required /></label><footer><button type="button" className="secondary" onClick={() => setShowUpload(false)}>Cancel</button><button className="primary" type="submit">Upload image</button></footer></form></div>}
    {showUpgrade && <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && setShowUpgrade(false)}><section className="modal upgrade-modal"><button className="icon-btn upgrade-close" aria-label="Close upgrade message" onClick={() => setShowUpgrade(false)}>×</button><div className="empty-icon"><ImageIcon size={27} /></div><h2>Upgrade to keep uploading</h2><p>The Free plan includes 5 image uploads per day. Your allowance resets tomorrow.</p><button className="primary upgrade-action" onClick={() => { setShowUpgrade(false); onOpenPlans(); }}>View plans</button></section></div>}
  </div>;
}
