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
import Announcements from './pages/Announcements';

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

  album_id?: number | null;
  album_name?: string | null;

  is_active: boolean;
};

type GalleryAlbum = {
  id: number;
  name: string;
  description?: string | null;
  display_order: number;
  is_active: boolean;
  created_at?: string;
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
  ['announcements', 'Announcements'],
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
  const [albums, setAlbums] = useState<GalleryAlbum[]>([]);

  const [editing, setEditing] =
    useState<Partial<Gallery> | null>(null);

  const [editingAlbum, setEditingAlbum] =
    useState<Partial<GalleryAlbum> | null>(null);

  const [error, setError] = useState('');

  const [imageMode, setImageMode] =
    useState<'url' | 'upload'>('url');

  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);

  const [busy, setBusy] = useState(false);
  const [albumBusy, setAlbumBusy] = useState(false);

  const [deletingId, setDeletingId] =
    useState<number | null>(null);

  const [deletingAlbumId, setDeletingAlbumId] =
    useState<number | null>(null);

  /*
   * -----------------------------------------
   * LOAD GALLERY IMAGES
   * -----------------------------------------
   */

  const load = async () => {
    try {
      const result = await apiRequest<{
        data: Gallery[];
      }>('/admin/gallery');

      setItems(result.data || []);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : 'Failed to load gallery'
      );
    }
  };

  /*
   * -----------------------------------------
   * LOAD GALLERY HEADINGS
   * -----------------------------------------
   */

  const loadAlbums = async () => {
    try {
      const result = await apiRequest<{
        success: boolean;
        data: GalleryAlbum[];
      }>('/admin/gallery-albums');

      setAlbums(result.data || []);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : 'Failed to load gallery headings'
      );
    }
  };

  useEffect(() => {
    load();
    loadAlbums();
  }, []);

  /*
   * =========================================
   * GALLERY HEADING / ALBUM
   * =========================================
   */

  function openAddAlbumForm() {
    setError('');

    setEditingAlbum({
      name: '',
      description: '',
      display_order: albums.length + 1,
      is_active: true,
    });
  }

  function openEditAlbumForm(
    album: GalleryAlbum
  ) {
    setError('');

    setEditingAlbum({
      ...album,
    });
  }

  async function saveAlbum(
    e: React.FormEvent
  ) {
    e.preventDefault();

    if (!editingAlbum?.name?.trim()) {
      setError('Heading name is required.');
      return;
    }

    setError('');
    setAlbumBusy(true);

    try {
      const isEditing =
        Boolean(editingAlbum.id);

      const endpoint = isEditing
        ? `/admin/gallery-albums/${editingAlbum.id}`
        : '/admin/gallery-albums';

      const method = isEditing
        ? 'PUT'
        : 'POST';

      await apiRequest(endpoint, {
        method,
        body: JSON.stringify({
          name: editingAlbum.name.trim(),

          description:
            editingAlbum.description?.trim() ||
            null,

          display_order:
            Number(
              editingAlbum.display_order
            ) || 0,

          is_active:
            editingAlbum.is_active !== false,
        }),
      });

      setEditingAlbum(null);

      await loadAlbums();
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : 'Failed to save gallery heading'
      );
    } finally {
      setAlbumBusy(false);
    }
  }

  async function deleteAlbum(
    album: GalleryAlbum
  ) {
    const imageCount = items.filter(
      (item) => item.album_id === album.id
    ).length;

    const message =
      imageCount > 0
        ? `"${album.name}" contains ${imageCount} image(s).\n\nDeleting the heading will NOT delete the images. They will become unassigned.\n\nContinue?`
        : `Delete the heading "${album.name}"?`;

    if (!window.confirm(message)) {
      return;
    }

    setError('');
    setDeletingAlbumId(album.id);

    try {
      await apiRequest(
        `/admin/gallery-albums/${album.id}`,
        {
          method: 'DELETE',
        }
      );

      await Promise.all([
        loadAlbums(),
        load(),
      ]);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : 'Failed to delete gallery heading'
      );
    } finally {
      setDeletingAlbumId(null);
    }
  }

  /*
   * =========================================
   * ADD GALLERY IMAGE
   * =========================================
   */

  function openAddForm(
    albumId?: number
  ) {
    setError('');
    setSelectedFile(null);
    setImageMode('url');

    setEditing({
      title: '',
      description: '',
      category: '',
      image_url: '',
      album_id:
        albumId ??
        (albums.length === 1
          ? albums[0].id
          : null),
      is_active: true,
    });
  }

  /*
   * -----------------------------------------
   * EDIT GALLERY IMAGE
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
   * =========================================
   * SAVE GALLERY IMAGE
   * =========================================
   */

  async function save(
    e: React.FormEvent
  ) {
    e.preventDefault();

    if (!editing) {
      return;
    }

    /*
     * Require a heading for NEW images.
     *
     * Existing legacy images are still allowed
     * to remain unassigned until edited.
     */
    if (
      !editing.id &&
      !editing.album_id
    ) {
      setError(
        'Please select a gallery heading.'
      );
      return;
    }

    setError('');
    setBusy(true);

    try {
      const isEditing =
        Boolean(editing.id);

      const endpoint = isEditing
        ? `/admin/gallery/${editing.id}`
        : '/admin/gallery';

      const method = isEditing
        ? 'PUT'
        : 'POST';

      /*
       * ---------------------------------------
       * UPLOAD IMAGE
       * ---------------------------------------
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
         * New image file selected
         */

        if (selectedFile) {
          const formData =
            new FormData();

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

          if (
            editing.category?.trim()
          ) {
            formData.append(
              'category',
              editing.category.trim()
            );
          }

          /*
           * NEW: send album_id
           */

          if (editing.album_id) {
            formData.append(
              'album_id',
              String(editing.album_id)
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
        }

        /*
         * Existing image.
         * No new file selected.
         */

        else {
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

                album_id:
                  editing.album_id ||
                  null,

                is_active:
                  editing.is_active !== false,
              }),
            }
          );
        }
      }

      /*
       * ---------------------------------------
       * IMAGE URL
       * ---------------------------------------
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

              /*
               * NEW
               */
              album_id:
                editing.album_id ||
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
   * =========================================
   * DELETE GALLERY IMAGE
   * =========================================
   */

  async function handleDeleteGallery(
    id: number
  ) {
    const confirmed =
      window.confirm(
        'Are you sure you want to permanently delete this gallery image?'
      );

    if (!confirmed) {
      return;
    }

    setError('');
    setDeletingId(id);

    try {
      await apiRequest(
        `/admin/gallery/${id}`,
        {
          method: 'DELETE',
        }
      );

      setItems((currentItems) =>
        currentItems.filter(
          (item) =>
            item.id !== id
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

  /*
   * =========================================
   * HELPER
   * =========================================
   */

  function getAlbumImageCount(
    albumId: number
  ) {
    return items.filter(
      (item) =>
        item.album_id === albumId
    ).length;
  }

  /*
   * =========================================
   * UI
   * =========================================
   */

  return (
    <Page
      title="Gallery"
      subtitle="Manage gallery headings and images shown in the devotee app"
      action={
        <div
          style={{
            display: 'flex',
            gap: '10px',
            flexWrap: 'wrap',
          }}
        >
          <button
            type="button"
            onClick={
              openAddAlbumForm
            }
            disabled={
              busy ||
              albumBusy ||
              deletingAlbumId !== null
            }
          >
            + Create Heading
          </button>

          <button
            type="button"
            className="primary"
            onClick={() =>
              openAddForm()
            }
            disabled={
              busy ||
              albumBusy ||
              deletingId !== null ||
              albums.length === 0
            }
          >
            + Add Image
          </button>
        </div>
      }
    >
      {error && (
        <div className="error">
          {error}
        </div>
      )}

      {albums.length === 0 &&
        !editingAlbum && (
          <div className="panel">
            <h3>
              Create your first gallery heading
            </h3>

            <p>
              Create a heading such as
              Anjaneya Swamy, Temple
              Outside or Festivals before
              adding new gallery images.
            </p>

            <button
              type="button"
              className="primary"
              onClick={
                openAddAlbumForm
              }
            >
              + Create Heading
            </button>
          </div>
        )}

      {/* =====================================
          CREATE / EDIT HEADING
          ===================================== */}

      {editingAlbum && (
        <form
          className="form-card"
          onSubmit={saveAlbum}
        >
          <h3>
            {editingAlbum.id
              ? 'Edit Gallery Heading'
              : 'Create Gallery Heading'}
          </h3>

          <div className="grid2">
            <label>
              Heading Name

              <input
                value={
                  editingAlbum.name ||
                  ''
                }
                onChange={(e) =>
                  setEditingAlbum({
                    ...editingAlbum,
                    name:
                      e.target.value,
                  })
                }
                placeholder="Anjaneya Swamy"
                required
              />
            </label>

            <label>
              Display Order

              <input
                type="number"
                min="0"
                value={
                  editingAlbum.display_order ??
                  0
                }
                onChange={(e) =>
                  setEditingAlbum({
                    ...editingAlbum,
                    display_order:
                      Number(
                        e.target.value
                      ),
                  })
                }
              />
            </label>
          </div>

          <label>
            Description

            <span
              style={{
                fontWeight:
                  'normal',
                fontSize: '12px',
              }}
            >
              {' '}
              (optional)
            </span>

            <textarea
              value={
                editingAlbum.description ||
                ''
              }
              onChange={(e) =>
                setEditingAlbum({
                  ...editingAlbum,
                  description:
                    e.target.value,
                })
              }
              placeholder="Optional heading description"
            />
          </label>

          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <input
              type="checkbox"
              checked={
                editingAlbum.is_active !==
                false
              }
              onChange={(e) =>
                setEditingAlbum({
                  ...editingAlbum,
                  is_active:
                    e.target.checked,
                })
              }
            />

            Active
          </label>

          <div className="actions">
            <button
              type="button"
              onClick={() =>
                setEditingAlbum(null)
              }
              disabled={albumBusy}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="primary"
              disabled={albumBusy}
            >
              {albumBusy
                ? 'Saving…'
                : editingAlbum.id
                  ? 'Save Heading'
                  : 'Create Heading'}
            </button>
          </div>
        </form>
      )}

      {/* =====================================
          HEADINGS
          ===================================== */}

      {albums.length > 0 && (
        <div
          className="panel"
          style={{
            marginBottom: '24px',
          }}
        >
          <h3>
            Gallery Headings
          </h3>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                'repeat(auto-fit, minmax(230px, 1fr))',
              gap: '14px',
              marginTop: '16px',
            }}
          >
            {albums.map(
              (album) => {
                const count =
                  getAlbumImageCount(
                    album.id
                  );

                return (
                  <div
                    key={album.id}
                    style={{
                      border:
                        '1px solid #e5e7eb',
                      borderRadius:
                        '12px',
                      padding: '16px',
                    }}
                  >
                    <div
                      style={{
                        display:
                          'flex',
                        justifyContent:
                          'space-between',
                        gap: '10px',
                      }}
                    >
                      <strong>
                        {album.name}
                      </strong>

                      <span className="badge">
                        {album.is_active
                          ? 'Active'
                          : 'Inactive'}
                      </span>
                    </div>

                    {album.description && (
                      <p>
                        {
                          album.description
                        }
                      </p>
                    )}

                    <p
                      style={{
                        margin:
                          '10px 0',
                      }}
                    >
                      <strong>
                        {count}
                      </strong>{' '}
                      {count === 1
                        ? 'photo'
                        : 'photos'}
                    </p>

                    <small>
                      Display order:{' '}
                      {
                        album.display_order
                      }
                    </small>

                    <div
                      className="actions"
                      style={{
                        marginTop:
                          '14px',
                      }}
                    >
                      <button
                        type="button"
                        className="primary"
                        onClick={() =>
                          openAddForm(
                            album.id
                          )
                        }
                      >
                        + Add Photo
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          openEditAlbumForm(
                            album
                          )
                        }
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        className="danger"
                        disabled={
                          deletingAlbumId ===
                          album.id
                        }
                        onClick={() =>
                          deleteAlbum(
                            album
                          )
                        }
                      >
                        {deletingAlbumId ===
                        album.id
                          ? 'Deleting…'
                          : 'Delete'}
                      </button>
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </div>
      )}

      {/* =====================================
          ADD / EDIT IMAGE
          ===================================== */}

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

          {/* HEADING */}

          <label>
            Gallery Heading

            <select
              value={
                editing.album_id ??
                ''
              }
              onChange={(e) =>
                setEditing({
                  ...editing,
                  album_id:
                    e.target.value
                      ? Number(
                          e.target
                            .value
                        )
                      : null,
                })
              }
              required={!editing.id}
            >
              <option value="">
                Select heading
              </option>

              {albums
                .filter(
                  (album) =>
                    album.is_active ||
                    album.id ===
                      editing.album_id
                )
                .map(
                  (album) => (
                    <option
                      key={
                        album.id
                      }
                      value={
                        album.id
                      }
                    >
                      {
                        album.name
                      }
                    </option>
                  )
                )}
            </select>
          </label>

          {/* IMAGE MODE */}

          <div
            style={{
              display: 'flex',
              gap: '10px',
              marginBottom:
                '18px',
              marginTop: '18px',
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
                imageMode ===
                'upload'
                  ? 'primary'
                  : ''
              }
              onClick={() => {
                setImageMode(
                  'upload'
                );
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
                placeholder="https://example.com/image.jpg"
              />
            </label>
          )}

          {/* FILE UPLOAD */}

          {imageMode ===
            'upload' && (
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
                  display:
                    'block',
                  marginTop:
                    '6px',
                }}
              >
                JPG, JPEG, PNG or
                WEBP · Maximum 5 MB
              </small>
            </label>
          )}

          <div className="grid2">
            <label>
              Title

              <span
                style={{
                  fontWeight:
                    'normal',
                  fontSize:
                    '12px',
                }}
              >
                {' '}
                (optional)
              </span>

              <input
                value={
                  editing.title ||
                  ''
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
                  fontWeight:
                    'normal',
                  fontSize:
                    '12px',
                }}
              >
                {' '}
                (optional)
              </span>

              <input
                value={
                  editing.category ||
                  ''
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

          <label>
            Description

            <span
              style={{
                fontWeight:
                  'normal',
                fontSize: '12px',
              }}
            >
              {' '}
              (optional)
            </span>

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
              placeholder="Optional description"
            />
          </label>

          {/* PREVIEW */}

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

          <div className="actions">
            <button
              type="button"
              onClick={() => {
                setEditing(null);
                setSelectedFile(
                  null
                );
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

      {/* =====================================
          EXISTING GALLERY IMAGES
          ===================================== */}

      <div
        style={{
          marginTop: '24px',
          marginBottom: '12px',
        }}
      >
        <h3>
          Gallery Images
        </h3>

        <p>
          Existing and newly uploaded
          gallery photos.
        </p>
      </div>

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

              {/* HEADING */}

              <div
                style={{
                  marginTop:
                    '6px',
                  marginBottom:
                    '6px',
                }}
              >
                <span className="badge">
                  {x.album_name ||
                    'Unassigned'}
                </span>
              </div>

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
                    deletingId !==
                    null
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
                    deletingId !==
                    null
                  }
                >
                  {deletingId ===
                  x.id
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
{page === 'announcements' && <Announcements />}
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