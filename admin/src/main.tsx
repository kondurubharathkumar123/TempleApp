import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';

import { apiRequest, clearAdminSession } from './lib/api';

import Activities from './pages/Activities';
import Bookings from './pages/Bookings';
import Darshan from './pages/Darshan';
import Events from './pages/Events';
import RoomBookings from './pages/RoomBookings';
import Rooms from './pages/Rooms';
import Users from './pages/Users';
import DarshanVideos from './pages/DarshanVideos';

import './styles.css';

type User = {
  id: number;
  full_name: string;
  email: string;
  phone?: string;
  role: string;
};

type Summary = {
  total_devotees: number;
  total_rooms: number;
  pending_room_bookings: number;
  confirmed_room_bookings: number;
  pending_service_bookings: number;
  confirmed_service_bookings: number;
};

type Deity = {
  id: number;
  name: string;
  description?: string;
  image_url?: string;
  significance?: string;
  devotional?: string;
  is_active: boolean;
};

type Gallery = {
  id: number;
  title: string;
  description?: string;
  image_url?: string;
  category?: string;
  is_active: boolean;
};

const nav = [
  ['dashboard', 'Dashboard'],
  ['deities', 'Deities'],
  ['darshan', 'Darshan'],
  ['darshan-videos', 'Darshan Videos'],
  ['activities', 'Activities'],
  ['events', 'Events'],
  ['gallery', 'Gallery'],
  ['users', 'Users'],
  ['room-bookings', 'Room Bookings'],
  ['bookings', 'Bookings'],
  ['rooms', 'Rooms'],
];

function Login({
  onLogin,
}: {
  onLogin: (user: User, token: string) => void;
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    setError('');
    setBusy(true);

    try {
      const result = await apiRequest<{
        success: boolean;
        data: {
          token: string;
          user: User;
        };
      }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (result.data.user.role !== 'admin') {
        throw new Error(
          'This account does not have admin access.'
        );
      }

      localStorage.setItem(
        'temple_admin_token',
        result.data.token
      );

      localStorage.setItem(
        'temple_admin_user',
        JSON.stringify(result.data.user)
      );

      onLogin(
        result.data.user,
        result.data.token
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Login failed'
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="login-shell">
      <form
        className="login-card"
        onSubmit={submit}
      >
        <div className="brand-mark">
          ॐ
        </div>

        <h1>Temple Admin</h1>

        <p>
          Manage temple content and operations
        </p>

        <label>
          Email

          <input
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            type="email"
            required
          />
        </label>

        <label>
          Password

          <input
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            type="password"
            required
          />
        </label>

        {error && (
          <div className="error">
            {error}
          </div>
        )}

        <button
          type="submit"
          className="primary wide"
          disabled={busy}
        >
          {busy
            ? 'Signing in…'
            : 'Sign in'}
        </button>
      </form>
    </div>
  );
}

function Dashboard() {
  const [summary, setSummary] =
    useState<Summary | null>(null);

  const [error, setError] =
    useState('');

  useEffect(() => {
    apiRequest<{ data: Summary }>(
      '/admin/dashboard'
    )
      .then((r) =>
        setSummary(r.data)
      )
      .catch((e) =>
        setError(e.message)
      );
  }, []);

  return (
    <Page
      title="Dashboard"
      subtitle="Temple platform overview"
    >
      {error && (
        <div className="error">
          {error}
        </div>
      )}

      <div className="stats">
        {[
          [
            'Devotees',
            summary?.total_devotees,
          ],
          [
            'Rooms',
            summary?.total_rooms,
          ],
          [
            'Pending room bookings',
            summary?.pending_room_bookings,
          ],
          [
            'Confirmed room bookings',
            summary?.confirmed_room_bookings,
          ],
          [
            'Pending seva bookings',
            summary?.pending_service_bookings,
          ],
          [
            'Confirmed seva bookings',
            summary?.confirmed_service_bookings,
          ],
        ].map(([k, v]) => (
          <div
            className="stat"
            key={String(k)}
          >
            <span>{k}</span>

            <strong>
              {v ?? '—'}
            </strong>
          </div>
        ))}
      </div>

      <div className="panel">
        <h3>
          Admin integration
        </h3>

        <p>
          Content entered here will be
          stored through the backend API
          and PostgreSQL, then consumed by
          the devotee mobile application.
        </p>
      </div>
    </Page>
  );
}

function Deities() {
  const [items, setItems] =
    useState<Deity[]>([]);

  const [editing, setEditing] =
    useState<Partial<Deity> | null>(
      null
    );

  const [error, setError] =
    useState('');

  const load = () =>
    apiRequest<{ data: Deity[] }>(
      '/admin/deities'
    )
      .then((r) =>
        setItems(r.data)
      )
      .catch((e) =>
        setError(e.message)
      );

  useEffect(() => {
    load();
  }, []);

  async function save(
    e: React.FormEvent
  ) {
    e.preventDefault();

    if (!editing?.name) {
      return;
    }

    try {
      const method = editing.id
        ? 'PUT'
        : 'POST';

      const endpoint = editing.id
        ? `/admin/deities/${editing.id}`
        : '/admin/deities';

      await apiRequest(endpoint, {
        method,
        body: JSON.stringify(
          editing
        ),
      });

      setEditing(null);
      load();
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : 'Save failed'
      );
    }
  }

  async function remove(id: number) {
    if (
      !window.confirm(
        'Deactivate this deity?'
      )
    ) {
      return;
    }

    try {
      await apiRequest(
        `/admin/deities/${id}`,
        {
          method: 'DELETE',
        }
      );

      load();
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : 'Delete failed'
      );
    }
  }

  return (
    <Page
      title="Deities"
      subtitle="Manage deity information displayed in the mobile app"
      action={
        <button
          className="primary"
          onClick={() =>
            setEditing({
              is_active: true,
            })
          }
        >
          + Add Deity
        </button>
      }
    >
      {error && (
        <div className="error">
          {error}
        </div>
      )}

      {editing && (
        <form
          className="form-card"
          onSubmit={save}
        >
          <h3>
            {editing.id
              ? 'Edit'
              : 'Add'}{' '}
            Deity
          </h3>

          <div className="grid2">
            <label>
              Name

              <input
                value={
                  editing.name || ''
                }
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    name: e.target.value,
                  })
                }
                required
              />
            </label>

            <label>
              Image URL

              <input
                value={
                  editing.image_url ||
                  ''
                }
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    image_url:
                      e.target.value,
                  })
                }
              />
            </label>
          </div>

          <label>
            Description

            <textarea
              value={
                editing.description ||
                ''
              }
              onChange={(e) =>
                setEditing({
                  ...editing,
                  description:
                    e.target.value,
                })
              }
            />
          </label>

          <label>
            Significance

            <textarea
              value={
                editing.significance ||
                ''
              }
              onChange={(e) =>
                setEditing({
                  ...editing,
                  significance:
                    e.target.value,
                })
              }
            />
          </label>

          <label>
            Devotional content

            <textarea
              value={
                editing.devotional ||
                ''
              }
              onChange={(e) =>
                setEditing({
                  ...editing,
                  devotional:
                    e.target.value,
                })
              }
            />
          </label>

          <div className="actions">
            <button
              type="button"
              onClick={() =>
                setEditing(null)
              }
            >
              Cancel
            </button>

            <button
              type="submit"
              className="primary"
            >
              Save Deity
            </button>
          </div>
        </form>
      )}

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Description</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {items.map((x) => (
              <tr key={x.id}>
                <td>
                  {x.image_url ? (
                    <img
                      className="thumb"
                      src={x.image_url}
                      alt={x.name}
                    />
                  ) : (
                    <div className="thumb empty">
                      —
                    </div>
                  )}
                </td>

                <td>
                  <strong>
                    {x.name}
                  </strong>
                </td>

                <td>
                  {x.description ||
                    '—'}
                </td>

                <td>
                  <span className="badge">
                    {x.is_active
                      ? 'Active'
                      : 'Inactive'}
                  </span>
                </td>

                <td>
                  <button
                    type="button"
                    onClick={() =>
                      setEditing(x)
                    }
                  >
                    Edit
                  </button>{' '}

                  <button
                    type="button"
                    className="danger"
                    onClick={() =>
                      remove(x.id)
                    }
                  >
                    Deactivate
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Page>
  );
}

function Gallery() {
  const [items, setItems] = useState<Gallery[]>([]);
  const [editing, setEditing] =
    useState<Partial<Gallery> | null>(null);

  const [error, setError] = useState('');

  const [imageMode, setImageMode] =
    useState<'url' | 'upload'>('url');

  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);

  const [busy, setBusy] = useState(false);
  const [deletingId, setDeletingId] =
    useState<number | null>(null);

  const load = async () => {
    try {
      const result = await apiRequest<{
        data: Gallery[];
      }>('/admin/gallery');

      setItems(result.data);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : 'Failed to load gallery'
      );
    }
  };

  useEffect(() => {
    load();
  }, []);

  /*
   * -----------------------------------------
   * ADD GALLERY FORM
   * -----------------------------------------
   */
  function openAddForm() {
    setError('');
    setSelectedFile(null);
    setImageMode('url');

    setEditing({
      title: '',
      description: '',
      category: '',
      image_url: '',
      is_active: true,
    });
  }

  /*
   * -----------------------------------------
   * EDIT GALLERY FORM
   * -----------------------------------------
   */
  function openEditForm(item: Gallery) {
    setError('');
    setSelectedFile(null);
    setImageMode('url');

    setEditing({
      ...item,
    });
  }

  /*
   * -----------------------------------------
   * FILE CHANGE
   * -----------------------------------------
   */
  function handleFileChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      setError(
        'Please select a JPG, JPEG, PNG or WEBP image.'
      );
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError(
        'Image size must be 5 MB or less.'
      );
      return;
    }

    setError('');
    setSelectedFile(file);

    setEditing((current) => ({
      ...current,
      image_url: URL.createObjectURL(file),
    }));
  }

  /*
   * -----------------------------------------
   * SAVE GALLERY
   * -----------------------------------------
   */
  async function save(
    e: React.FormEvent
  ) {
    e.preventDefault();

    if (!editing) {
      return;
    }

    setError('');
    setBusy(true);

    try {
      const isEditing = Boolean(editing.id);

      const endpoint = isEditing
        ? `/admin/gallery/${editing.id}`
        : '/admin/gallery';

      const method = isEditing
        ? 'PUT'
        : 'POST';

      /*
       * -----------------------------------------
       * UPLOAD IMAGE
       * -----------------------------------------
       */
      if (imageMode === 'upload') {
        if (
          !selectedFile &&
          !editing.image_url
        ) {
          throw new Error(
            'Please select an image.'
          );
        }

        /*
         * New image selected
         */
        if (selectedFile) {
          const formData = new FormData();

          formData.append(
            'image',
            selectedFile
          );

          if (editing.title?.trim()) {
            formData.append(
              'title',
              editing.title.trim()
            );
          }

          if (
            editing.description?.trim()
          ) {
            formData.append(
              'description',
              editing.description.trim()
            );
          }

          if (editing.category?.trim()) {
            formData.append(
              'category',
              editing.category.trim()
            );
          }

          formData.append(
            'is_active',
            String(
              editing.is_active !== false
            )
          );

          await apiRequest(
            endpoint,
            {
              method,
              body: formData,
            }
          );
        } else {
          /*
           * Existing image.
           * Only update text/category/status.
           */
          await apiRequest(
            endpoint,
            {
              method,
              body: JSON.stringify({
                title:
                  editing.title?.trim() ||
                  null,

                description:
                  editing.description?.trim() ||
                  null,

                category:
                  editing.category?.trim() ||
                  null,

                is_active:
                  editing.is_active !== false,
              }),
            }
          );
        }
      }

      /*
       * -----------------------------------------
       * IMAGE URL
       * -----------------------------------------
       */
      else {
        const imageUrl =
          editing.image_url?.trim();

        if (!imageUrl) {
          throw new Error(
            'Please enter an image URL.'
          );
        }

        await apiRequest(
          endpoint,
          {
            method,
            body: JSON.stringify({
              title:
                editing.title?.trim() ||
                null,

              description:
                editing.description?.trim() ||
                null,

              image_url: imageUrl,

              category:
                editing.category?.trim() ||
                null,

              is_active:
                editing.is_active !== false,
            }),
          }
        );
      }

      setEditing(null);
      setSelectedFile(null);

      await load();
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : 'Save failed'
      );
    } finally {
      setBusy(false);
    }
  }

  /*
   * -----------------------------------------
   * PERMANENT DELETE GALLERY IMAGE
   * -----------------------------------------
   */
  async function handleDeleteGallery(
    id: number
  ) {
    const confirmed = window.confirm(
      'Are you sure you want to permanently delete this gallery image?'
    );

    if (!confirmed) {
      return;
    }

    setError('');
    setDeletingId(id);

    try {
      /*
       * DELETE FROM DATABASE
       */
      await apiRequest(
        `/admin/gallery/${id}`,
        {
          method: 'DELETE',
        }
      );

      /*
       * Remove immediately from admin UI.
       */
      setItems((currentItems) =>
        currentItems.filter(
          (item) => item.id !== id
        )
      );
    } catch (error) {
      console.error(
        'Delete gallery image error:',
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : 'Failed to delete gallery image'
      );
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <Page
      title="Gallery"
      subtitle="Manage images shown in the devotee app"
      action={
        <button
          className="primary"
          onClick={openAddForm}
          disabled={busy || deletingId !== null}
        >
          + Add Image
        </button>
      }
    >
      {error && (
        <div className="error">
          {error}
        </div>
      )}

      {/* ADD / EDIT FORM */}

      {editing && (
        <form
          className="form-card"
          onSubmit={save}
        >
          <h3>
            {editing.id
              ? 'Edit Gallery Image'
              : 'Add Gallery Image'}
          </h3>

          {/* IMAGE MODE */}

          <div
            style={{
              display: 'flex',
              gap: '10px',
              marginBottom: '18px',
            }}
          >
            <button
              type="button"
              className={
                imageMode === 'url'
                  ? 'primary'
                  : ''
              }
              onClick={() => {
                setImageMode('url');
                setSelectedFile(null);
                setError('');
              }}
            >
              Image URL
            </button>

            <button
              type="button"
              className={
                imageMode === 'upload'
                  ? 'primary'
                  : ''
              }
              onClick={() => {
                setImageMode('upload');
                setError('');
              }}
            >
              Upload Image
            </button>
          </div>

          {/* IMAGE URL */}

          {imageMode === 'url' && (
            <label>
              Image URL

              <input
                type="url"
                value={
                  editing.image_url || ''
                }
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    image_url:
                      e.target.value,
                  })
                }
                placeholder="https://example.com/image.jpg"
              />
            </label>
          )}

          {/* UPLOAD IMAGE */}

          {imageMode === 'upload' && (
            <label>
              Upload Image

              <input
                type="file"
                accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                onChange={
                  handleFileChange
                }
              />

              <small
                style={{
                  display: 'block',
                  marginTop: '6px',
                }}
              >
                JPG, JPEG, PNG or WEBP ·
                Maximum 5 MB
              </small>
            </label>
          )}

          {/* TITLE / CATEGORY */}

          <div className="grid2">
            <label>
              Title

              <span
                style={{
                  fontWeight: 'normal',
                  fontSize: '12px',
                }}
              >
                {' '}
                (optional)
              </span>

              <input
                value={
                  editing.title || ''
                }
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    title:
                      e.target.value,
                  })
                }
                placeholder="Temple Entrance"
              />
            </label>

            <label>
              Category

              <span
                style={{
                  fontWeight: 'normal',
                  fontSize: '12px',
                }}
              >
                {' '}
                (optional)
              </span>

              <input
                value={
                  editing.category || ''
                }
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    category:
                      e.target.value,
                  })
                }
                placeholder="Temple"
              />
            </label>
          </div>

          {/* DESCRIPTION */}

          <label>
            Description

            <span
              style={{
                fontWeight: 'normal',
                fontSize: '12px',
              }}
            >
              {' '}
              (optional)
            </span>

            <textarea
              value={
                editing.description || ''
              }
              onChange={(e) =>
                setEditing({
                  ...editing,
                  description:
                    e.target.value,
                })
              }
              placeholder="Optional description"
            />
          </label>

          {/* IMAGE PREVIEW */}

          {editing.image_url && (
            <img
              className="preview"
              src={
                editing.image_url.startsWith(
                  '/uploads/'
                )
                  ? `${window.location.origin}${editing.image_url}`
                  : editing.image_url
              }
              alt={
                editing.title ||
                'Gallery preview'
              }
            />
          )}

          {/* ACTIONS */}

          <div className="actions">
            <button
              type="button"
              onClick={() => {
                setEditing(null);
                setSelectedFile(null);
              }}
              disabled={busy}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="primary"
              disabled={busy}
            >
              {busy
                ? 'Saving…'
                : editing.id
                  ? 'Save Changes'
                  : 'Add Image'}
            </button>
          </div>
        </form>
      )}

      {/* GALLERY LIST */}

      <div className="gallery-grid">
        {items.map((x) => (
          <div
            className="gallery-card"
            key={x.id}
          >
            {x.image_url ? (
              <img
                src={
                  x.image_url.startsWith(
                    '/uploads/'
                  )
                    ? `${window.location.origin}${x.image_url}`
                    : x.image_url
                }
                alt={
                  x.title ||
                  'Gallery image'
                }
              />
            ) : (
              <div className="gallery-empty">
                No image
              </div>
            )}

            <div className="gallery-body">
              <strong>
                {x.title ||
                  'Gallery Image'}
              </strong>

              {x.category && (
                <span>
                  {x.category}
                </span>
              )}

              {x.description && (
                <p>
                  {x.description}
                </p>
              )}

              <div className="actions">
                <button
                  type="button"
                  onClick={() =>
                    openEditForm(x)
                  }
                  disabled={
                    deletingId !== null
                  }
                >
                  Edit
                </button>

                <button
                  type="button"
                  className="danger"
                  onClick={() =>
                    handleDeleteGallery(
                      x.id
                    )
                  }
                  disabled={
                    deletingId !== null
                  }
                >
                  {deletingId === x.id
                    ? 'Deleting…'
                    : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Page>
  );
}

function Page({
  title,
  subtitle,
  action,
  children,
}: {
  title: string;
  subtitle: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <main className="content">
      <div className="page-head">
        <div>
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>

        {action}
      </div>

      {children}
    </main>
  );
}

function App() {
  const [user, setUser] =
    useState<User | null>(() => {
      const raw =
        localStorage.getItem(
          'temple_admin_user'
        );

      return raw
        ? JSON.parse(raw)
        : null;
    });

  const [page, setPage] =
    useState('dashboard');

  if (!user) {
    return (
      <Login
        onLogin={(u) =>
          setUser(u)
        }
      />
    );
  }

  function logout() {
    clearAdminSession();
    setUser(null);
  }

  return (
    <div className="app">

      <aside>
        <div className="side-brand">
          <span>
            ॐ
          </span>

          <div>
            <strong>
              Temple Admin
            </strong>

            <small>
              Management Portal
            </small>
          </div>
        </div>

        <nav>
          {nav.map(
            ([id, label]) => (
              <button
                type="button"
                className={
                  page === id
                    ? 'active'
                    : ''
                }
                key={id}
                onClick={() =>
                  setPage(id)
                }
              >
                {label}
              </button>
            )
          )}
        </nav>

        <div className="side-bottom">
          <div className="admin-user">
            <strong>
              {user.full_name}
            </strong>

            <small>
              {user.email}
            </small>
          </div>

          <button
            type="button"
            onClick={logout}
          >
            Sign out
          </button>
        </div>
      </aside>

      {page === 'dashboard' && (
        <Dashboard />
      )}

      {page === 'deities' && (
        <Deities />
      )}

      {page === 'activities' && (
        <Activities />
      )}

      {page === 'gallery' && (
        <Gallery />
      )}

      {page === 'users' && (
        <Users />
      )}

      {page === 'bookings' && (
        <Bookings />
      )}

      {page === 'rooms' && (
        <Rooms />
      )}

      {page === 'room-bookings' && (
        <RoomBookings />
      )}

      {page === 'events' && (
        <Events />
      )}

      {page === 'darshan' && (
        <Darshan />
      )}
      {page === 'darshan-videos' && (
  <DarshanVideos />
)}
    </div>
  );
}

createRoot(
  document.getElementById('root')!
).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);