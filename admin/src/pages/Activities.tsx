import { FormEvent, useEffect, useState } from 'react';
import { apiRequest } from '../lib/api';

type Activity = {
  id: number;
  title: string;
  description?: string;
  image_url?: string;
  activity_date?: string;
  location?: string;
  is_active: boolean;
};

type ActivityForm = {
  title: string;
  description: string;
  image_url: string;
  activity_date: string;
  location: string;
  is_active: boolean;
};

const emptyForm: ActivityForm = {
  title: '',
  description: '',
  image_url: '',
  activity_date: '',
  location: '',
  is_active: true,
};

export default function Activities() {
  const [items, setItems] = useState<Activity[]>([]);
  const [form, setForm] = useState<ActivityForm>(emptyForm);
  const [editing, setEditing] = useState<number | null>(null);
  const [imageMode, setImageMode] = useState<'url' | 'upload'>('url');
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function loadActivities() {
    try {
      setLoading(true);
      setError('');

      // ADMIN API
      const result = await apiRequest<{
        success: boolean;
        data: Activity[];
      }>('/admin/activities');

      setItems(result.data || []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to load activities'
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadActivities();
  }, []);

  function updateField(
    field: keyof ActivityForm,
    value: string | boolean
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function startEdit(activity: Activity) {
    setEditing(activity.id);

    setForm({
      title: activity.title || '',
      description: activity.description || '',
      image_url: activity.image_url || '',
      activity_date: activity.activity_date
        ? activity.activity_date.substring(0, 10)
        : '',
      location: activity.location || '',
      is_active: activity.is_active,
    });

    setImageMode('url');

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  function cancelEdit() {
    setEditing(null);
    setForm(emptyForm);
    setImageMode('url');
    setError('');
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (!form.title.trim()) {
      setError('Activity title is required.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      if (editing !== null) {
        // ADMIN UPDATE
        await apiRequest(`/admin/activities/${editing}`, {
          method: 'PUT',
          body: JSON.stringify(form),
        });
      } else {
        // ADMIN CREATE
        await apiRequest('/admin/activities', {
          method: 'POST',
          body: JSON.stringify(form),
        });
      }

      await loadActivities();
      cancelEdit();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to save activity'
      );
    } finally {
      setLoading(false);
    }
  }

  async function toggleActivity(activity: Activity) {
    try {
      setError('');
      setLoading(true);

      await apiRequest(`/admin/activities/${activity.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          title: activity.title,
          description: activity.description || '',
          image_url: activity.image_url || '',
          activity_date: activity.activity_date
            ? activity.activity_date.substring(0, 10)
            : '',
          location: activity.location || '',
          is_active: !activity.is_active,
        }),
      });

      await loadActivities();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to update activity'
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleImageUpload(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      setUploading(true);
      setError('');

      /*
       * IMPORTANT:
       * This is only a temporary browser preview.
       *
       * The actual upload to the backend/storage will be
       * connected after the admin activity API is working.
       */

      const previewUrl = URL.createObjectURL(file);

      setForm((current) => ({
        ...current,
        image_url: previewUrl,
      }));
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to select image'
      );
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Activities</h1>
          <p>
            Manage activities shown in the devotee app
          </p>
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="card">
        <h2>
          {editing !== null
            ? 'Edit Activity'
            : 'Add Activity'}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-field">
              <label>Title *</label>

              <input
                type="text"
                value={form.title}
                onChange={(event) =>
                  updateField(
                    'title',
                    event.target.value
                  )
                }
                placeholder="Enter activity title"
                required
              />
            </div>

            <div className="form-field">
              <label>Activity Date</label>

              <input
                type="date"
                value={form.activity_date}
                onChange={(event) =>
                  updateField(
                    'activity_date',
                    event.target.value
                  )
                }
              />
            </div>

            <div className="form-field">
              <label>Location</label>

              <input
                type="text"
                value={form.location}
                onChange={(event) =>
                  updateField(
                    'location',
                    event.target.value
                  )
                }
                placeholder="Enter location"
              />
            </div>
          </div>

          <div className="form-field">
            <label>Description</label>

            <textarea
              value={form.description}
              onChange={(event) =>
                updateField(
                  'description',
                  event.target.value
                )
              }
              placeholder="Enter activity description"
              rows={5}
            />
          </div>

          <div className="form-field">
            <label>Activity Image</label>

            <div className="image-mode-buttons">
              <button
                type="button"
                className={
                  imageMode === 'url'
                    ? 'mode-button active'
                    : 'mode-button'
                }
                onClick={() => setImageMode('url')}
              >
                Image URL
              </button>

              <button
                type="button"
                className={
                  imageMode === 'upload'
                    ? 'mode-button active'
                    : 'mode-button'
                }
                onClick={() => setImageMode('upload')}
              >
                Upload Image
              </button>
            </div>

            {imageMode === 'url' && (
              <input
                type="text"
                value={form.image_url}
                onChange={(event) =>
                  updateField(
                    'image_url',
                    event.target.value
                  )
                }
                placeholder="https://example.com/activity-image.jpg"
              />
            )}

            {imageMode === 'upload' && (
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
              />
            )}

            {form.image_url && (
              <div className="image-preview">
                <img
                  src={form.image_url}
                  alt="Activity preview"
                  onError={(event) => {
                    event.currentTarget.style.display =
                      'none';
                  }}
                />
              </div>
            )}
          </div>

          <div className="form-field">
            <label>Status</label>

            <select
              value={form.is_active ? 'active' : 'inactive'}
              onChange={(event) =>
                updateField(
                  'is_active',
                  event.target.value === 'active'
                )
              }
            >
              <option value="active">
                Active
              </option>
              <option value="inactive">
                Inactive
              </option>
            </select>
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="primary-button"
              disabled={loading || uploading}
            >
              {loading
                ? 'Saving...'
                : editing !== null
                ? 'Update Activity'
                : 'Add Activity'}
            </button>

            {editing !== null && (
              <button
                type="button"
                className="secondary-button"
                onClick={cancelEdit}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="card">
        <div className="section-header">
          <div>
            <h2>Activities</h2>
            <p>
              Activities managed by the admin
            </p>
          </div>
        </div>

        {loading && items.length === 0 ? (
          <p>Loading activities...</p>
        ) : items.length === 0 ? (
          <p>No activities found.</p>
        ) : (
          <div className="items-list">
            {items.map((activity) => (
              <div
                className="item-row"
                key={activity.id}
              >
                <div className="item-image">
                  {activity.image_url ? (
                    <img
                      src={activity.image_url}
                      alt={activity.title}
                    />
                  ) : (
                    <div className="no-image">
                      No Image
                    </div>
                  )}
                </div>

                <div className="item-content">
                  <h3>{activity.title}</h3>

                  {activity.description && (
                    <p>
                      {activity.description}
                    </p>
                  )}

                  {activity.activity_date && (
                    <span>
                      Date:{' '}
                      {activity.activity_date.substring(
                        0,
                        10
                      )}
                    </span>
                  )}

                  {activity.location && (
                    <span>
                      Location:{' '}
                      {activity.location}
                    </span>
                  )}

                  <span>
                    Status:{' '}
                    {activity.is_active
                      ? 'Active'
                      : 'Inactive'}
                  </span>
                </div>

                <div className="item-actions">
                  <button
                    type="button"
                    onClick={() =>
                      startEdit(activity)
                    }
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      toggleActivity(activity)
                    }
                  >
                    {activity.is_active
                      ? 'Deactivate'
                      : 'Activate'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}