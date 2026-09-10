import React, { useEffect, useState } from 'react';
import { apiRequest } from '../lib/api';

type DarshanVideo = {
  id: number;
  title: string;
  description?: string;
  label: 'live' | 'watch';
  url: string;
  thumbnail_url?: string;
  is_active: boolean;
  created_at?: string;
};

export default function DarshanVideos() {
  const [items, setItems] = useState<DarshanVideo[]>([]);
  const [editing, setEditing] =
    useState<Partial<DarshanVideo> | null>(null);

  const [imageMode, setImageMode] =
    useState<'url' | 'upload'>('url');

  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);

  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const load = async () => {
    try {
      setError('');

      const result = await apiRequest<{
        data: DarshanVideo[];
      }>('/admin/darshan-videos');

      setItems(result.data);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : 'Failed to load Darshan Videos'
      );
    }
  };

  useEffect(() => {
    load();
  }, []);

  function openAddForm() {
    setError('');
    setSelectedFile(null);
    setImageMode('url');

    setEditing({
      title: '',
      description: '',
      label: 'watch',
      url: '',
      thumbnail_url: '',
      is_active: true,
    });
  }

  function openEditForm(item: DarshanVideo) {
    setError('');
    setSelectedFile(null);
    setImageMode('url');

    setEditing({
      ...item,
    });
  }

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
      setError('Image size must be 5 MB or less.');
      return;
    }

    setError('');
    setSelectedFile(file);

    setEditing((current) => ({
      ...current,
      thumbnail_url: URL.createObjectURL(file),
    }));
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();

    if (!editing) {
      return;
    }

    if (!editing.title?.trim()) {
      setError('Please enter a title.');
      return;
    }

    if (!editing.url?.trim()) {
      setError('Please enter the YouTube URL.');
      return;
    }

    if (!editing.label) {
      setError('Please select Live or Watch.');
      return;
    }

    setError('');
    setBusy(true);

    try {
      const isEditing = Boolean(editing.id);

      const endpoint = isEditing
        ? `/admin/darshan-videos/${editing.id}`
        : '/admin/darshan-videos';

      const method = isEditing ? 'PUT' : 'POST';

      /*
       * UPLOAD THUMBNAIL
       */
      if (imageMode === 'upload' && selectedFile) {
        const formData = new FormData();

        formData.append(
          'thumbnail',
          selectedFile
        );

        formData.append(
          'title',
          editing.title.trim()
        );

        formData.append(
          'description',
          editing.description?.trim() || ''
        );

        formData.append(
          'label',
          editing.label
        );

        formData.append(
          'url',
          editing.url.trim()
        );

        formData.append(
          'is_active',
          String(editing.is_active !== false)
        );

        await apiRequest(endpoint, {
          method,
          body: formData,
        });
      }

      /*
       * THUMBNAIL URL
       */
      else {
        await apiRequest(endpoint, {
          method,
          body: JSON.stringify({
            title: editing.title.trim(),
            description:
              editing.description?.trim() || null,
            label: editing.label,
            url: editing.url.trim(),
            thumbnail_url:
              editing.thumbnail_url?.trim() || null,
            is_active:
              editing.is_active !== false,
          }),
        });
      }

      setEditing(null);
      setSelectedFile(null);

      await load();
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : 'Failed to save Darshan Video'
      );
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: number) {
    if (
      !window.confirm(
        'Are you sure you want to delete this Darshan Video?'
      )
    ) {
      return;
    }

    try {
      setError('');

      await apiRequest(
        `/admin/darshan-videos/${id}`,
        {
          method: 'DELETE',
        }
      );

      setItems((current) =>
        current.filter((item) => item.id !== id)
      );
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : 'Failed to delete Darshan Video'
      );
    }
  }

  return (
    <main className="content">
      <div className="page-head">
        <div>
          <h2>Darshan Videos</h2>

          <p>
            Manage YouTube live and watch videos
            displayed in the devotee app.
          </p>
        </div>

        <button
          className="primary"
          onClick={openAddForm}
          disabled={busy}
        >
          + Add Video
        </button>
      </div>

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
              ? 'Edit Darshan Video'
              : 'Add Darshan Video'}
          </h3>

          <div className="grid2">
            <label>
              Title

              <input
                value={editing.title || ''}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    title: e.target.value,
                  })
                }
                placeholder="Live Darshan"
                required
              />
            </label>

            <label>
              Label

              <select
                value={editing.label || 'watch'}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    label:
                      e.target.value as
                        | 'live'
                        | 'watch',
                  })
                }
              >
                <option value="live">
                  Live
                </option>

                <option value="watch">
                  Watch
                </option>
              </select>
            </label>
          </div>

          <label>
            YouTube URL

            <input
              type="url"
              value={editing.url || ''}
              onChange={(e) =>
                setEditing({
                  ...editing,
                  url: e.target.value,
                })
              }
              placeholder="https://www.youtube.com/watch?v=..."
              required
            />
          </label>

          <label>
            Description

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

          {/* THUMBNAIL MODE */}

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
              Thumbnail URL
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
              Upload Thumbnail
            </button>
          </div>

          {/* THUMBNAIL URL */}

          {imageMode === 'url' && (
            <label>
              Thumbnail URL

              <input
                type="url"
                value={
                  editing.thumbnail_url || ''
                }
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    thumbnail_url:
                      e.target.value,
                  })
                }
                placeholder="https://example.com/thumbnail.jpg"
              />
            </label>
          )}

          {/* THUMBNAIL UPLOAD */}

          {imageMode === 'upload' && (
            <label>
              Upload Thumbnail

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

          {/* PREVIEW */}

          {editing.thumbnail_url && (
            <img
              className="preview"
              src={
                editing.thumbnail_url.startsWith(
                  '/uploads/'
                )
                  ? `${window.location.origin}${editing.thumbnail_url}`
                  : editing.thumbnail_url
              }
              alt={
                editing.title ||
                'Thumbnail preview'
              }
            />
          )}

          <label>
            <input
              type="checkbox"
              checked={
                editing.is_active !== false
              }
              onChange={(e) =>
                setEditing({
                  ...editing,
                  is_active:
                    e.target.checked,
                })
              }
            />{' '}
            Active
          </label>

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
                  : 'Add Video'}
            </button>
          </div>
        </form>
      )}

      {/* VIDEO LIST */}

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Thumbnail</th>
              <th>Title</th>
              <th>Label</th>
              <th>YouTube URL</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>
                  {item.thumbnail_url ? (
                    <img
                      className="thumb"
                      src={
                        item.thumbnail_url.startsWith(
                          '/uploads/'
                        )
                          ? `${window.location.origin}${item.thumbnail_url}`
                          : item.thumbnail_url
                      }
                      alt={item.title}
                    />
                  ) : (
                    <div className="thumb empty">
                      —
                    </div>
                  )}
                </td>

                <td>
                  <strong>
                    {item.title}
                  </strong>

                  {item.description && (
                    <div>
                      {item.description}
                    </div>
                  )}
                </td>

                <td>
                  <span className="badge">
                    {item.label === 'live'
                      ? 'LIVE'
                      : 'WATCH'}
                  </span>
                </td>

                <td>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open YouTube
                  </a>
                </td>

                <td>
                  <span className="badge">
                    {item.is_active
                      ? 'Active'
                      : 'Inactive'}
                  </span>
                </td>

                <td>
                  <button
                    type="button"
                    onClick={() =>
                      openEditForm(item)
                    }
                  >
                    Edit
                  </button>{' '}

                  <button
                    type="button"
                    className="danger"
                    onClick={() =>
                      remove(item.id)
                    }
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}