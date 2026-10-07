import { FormEvent, useEffect, useState } from 'react';

import { apiRequest } from '../lib/api';

type Activity = {
  id: number;
  title: string;
  description?: string;
  image_url?: string;
  activity_date?: string;
  location?: string;
  section_id?: number;
  section_name?: string;
  display_order: number;
  is_active: boolean;
};

type ActivitySection = {
  id: number;
  name: string;
  description?: string;
  icon?: string;
  image_url?: string;
  display_order: number;
  is_active: boolean;
};

type ActivitySectionForm = {
  name: string;
  description: string;
  icon: string;
  image_url: string;
  display_order: number;
  is_active: boolean;
};

type ActivityForm = {
  title: string;
  description: string;
  image_url: string;
  activity_date: string;
  location: string;
  section_id: number | '';
  display_order: number;
  is_active: boolean;
};

const emptyForm: ActivityForm = {
  title: '',
  description: '',
  image_url: '',
  activity_date: '',
  location: '',
  section_id: '',
  display_order: 0,
  is_active: true,
};

const emptySectionForm: ActivitySectionForm = {
  name: '',
  description: '',
  icon: '',
  image_url: '',
  display_order: 0,
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

  // Activity sections
  const [sections, setSections] = useState<ActivitySection[]>([]);
  const [sectionForm, setSectionForm] =
    useState<ActivitySectionForm>(emptySectionForm);
  const [editingSection, setEditingSection] =
    useState<number | null>(null);
  const [sectionLoading, setSectionLoading] = useState(false);
  const [sectionError, setSectionError] = useState('');

  async function loadActivities() {
    try {
      setLoading(true);
      setError('');

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

  async function loadSections() {
    try {
      setSectionLoading(true);
      setSectionError('');

      const result = await apiRequest<{
        success: boolean;
        data: ActivitySection[];
      }>('/activity-sections/admin/all');

      setSections(result.data || []);
    } catch (err) {
      setSectionError(
        err instanceof Error
          ? err.message
          : 'Failed to load activity sections'
      );
    } finally {
      setSectionLoading(false);
    }
  }

  useEffect(() => {
    loadActivities();
    loadSections();
  }, []);

  function updateField(
    field: keyof ActivityForm,
    value: string | number | boolean
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
      section_id: activity.section_id ?? '',
      display_order: activity.display_order ?? 0,
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

    if (!form.section_id) {
      setError('Activity section is required.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      if (editing !== null) {
        await apiRequest(`/admin/activities/${editing}`, {
          method: 'PUT',
          body: JSON.stringify(form),
        });
      } else {
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

      if (!activity.section_id) {
        setError(
          'This activity does not have a section. Please edit it and select a section.'
        );
        return;
      }

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
          section_id: activity.section_id,
          display_order: activity.display_order ?? 0,
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

  function updateSectionField(
    field: keyof ActivitySectionForm,
    value: string | number | boolean
  ) {
    setSectionForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function startEditSection(section: ActivitySection) {
    setEditingSection(section.id);

    setSectionForm({
      name: section.name || '',
      description: section.description || '',
      icon: section.icon || '',
      image_url: section.image_url || '',
      display_order: section.display_order ?? 0,
      is_active: section.is_active,
    });
  }

  function cancelSectionEdit() {
    setEditingSection(null);
    setSectionForm(emptySectionForm);
    setSectionError('');
  }

  async function handleSectionSubmit(event: FormEvent) {
    event.preventDefault();

    if (!sectionForm.name.trim()) {
      setSectionError('Section name is required.');
      return;
    }

    try {
      setSectionLoading(true);
      setSectionError('');

      if (editingSection !== null) {
        await apiRequest(
          `/activity-sections/admin/${editingSection}`,
          {
            method: 'PUT',
            body: JSON.stringify(sectionForm),
          }
        );
      } else {
        await apiRequest('/activity-sections/admin', {
          method: 'POST',
          body: JSON.stringify(sectionForm),
        });
      }

      await loadSections();
      cancelSectionEdit();
    } catch (err) {
      setSectionError(
        err instanceof Error
          ? err.message
          : 'Failed to save activity section'
      );
    } finally {
      setSectionLoading(false);
    }
  }

  async function toggleSection(section: ActivitySection) {
    try {
      setSectionLoading(true);
      setSectionError('');

      await apiRequest(
        `/activity-sections/admin/${section.id}`,
        {
          method: 'PUT',
          body: JSON.stringify({
            name: section.name,
            description: section.description || '',
            icon: section.icon || '',
            image_url: section.image_url || '',
            display_order: section.display_order ?? 0,
            is_active: !section.is_active,
          }),
        }
      );

      await loadSections();
    } catch (err) {
      setSectionError(
        err instanceof Error
          ? err.message
          : 'Failed to update activity section'
      );
    } finally {
      setSectionLoading(false);
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
            Manage activity sections and activities shown in
            the devotee app
          </p>
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* ============================= */}
      {/* ACTIVITY SECTIONS */}
      {/* ============================= */}

      <div className="card">
        <div className="section-header">
          <div>
            <h2>Activity Sections</h2>
            <p>
              Create and manage categories for activities
            </p>
          </div>
        </div>

        {sectionError && (
          <div className="error-message">
            {sectionError}
          </div>
        )}

        <form onSubmit={handleSectionSubmit}>
          <div className="form-grid">
            <div className="form-field">
              <label>Section Name *</label>

              <input
                type="text"
                value={sectionForm.name}
                onChange={(event) =>
                  updateSectionField(
                    'name',
                    event.target.value
                  )
                }
                placeholder="Example: Yearly Activities"
                required
              />
            </div>

            <div className="form-field">
              <label>Icon</label>

              <input
                type="text"
                value={sectionForm.icon}
                onChange={(event) =>
                  updateSectionField(
                    'icon',
                    event.target.value
                  )
                }
                placeholder="Example: 📅"
              />
            </div>

            <div className="form-field">
              <label>Display Order</label>

              <input
                type="number"
                min="0"
                value={sectionForm.display_order}
                onChange={(event) =>
                  updateSectionField(
                    'display_order',
                    Number(event.target.value)
                  )
                }
              />
            </div>

            <div className="form-field">
              <label>Status</label>

              <select
                value={
                  sectionForm.is_active
                    ? 'active'
                    : 'inactive'
                }
                onChange={(event) =>
                  updateSectionField(
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
          </div>

          <div className="form-field">
            <label>Short Description</label>

            <textarea
              value={sectionForm.description}
              onChange={(event) =>
                updateSectionField(
                  'description',
                  event.target.value
                )
              }
              placeholder="Enter short section description"
              rows={3}
            />
          </div>

          <div className="form-field">
            <label>Section Image URL</label>

            <input
              type="text"
              value={sectionForm.image_url}
              onChange={(event) =>
                updateSectionField(
                  'image_url',
                  event.target.value
                )
              }
              placeholder="https://example.com/section-image.jpg"
            />
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="primary-button"
              disabled={sectionLoading}
            >
              {sectionLoading
                ? 'Saving...'
                : editingSection !== null
                ? 'Update Section'
                : 'Add Section'}
            </button>

            {editingSection !== null && (
              <button
                type="button"
                className="secondary-button"
                onClick={cancelSectionEdit}
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        <div style={{ marginTop: '24px' }}>
          <h3>Existing Sections</h3>

          {sectionLoading && sections.length === 0 ? (
            <p>Loading sections...</p>
          ) : sections.length === 0 ? (
            <p>No activity sections found.</p>
          ) : (
            <div className="items-list">
              {sections.map((section) => (
                <div
                  className="item-row"
                  key={section.id}
                >
                  <div className="item-image">
                    {section.image_url ? (
                      <img
                        src={section.image_url}
                        alt={section.name}
                      />
                    ) : (
                      <div className="no-image">
                        {section.icon || '📂'}
                      </div>
                    )}
                  </div>

                  <div className="item-content">
                    <h3>
                      {section.icon
                        ? `${section.icon} `
                        : ''}
                      {section.name}
                    </h3>

                    {section.description && (
                      <p>
                        {section.description}
                      </p>
                    )}

                    <span>
                      Display Order:{' '}
                      {section.display_order}
                    </span>

                    <span>
                      Status:{' '}
                      {section.is_active
                        ? 'Active'
                        : 'Inactive'}
                    </span>
                  </div>

                  <div className="item-actions">
                    <button
                      type="button"
                      onClick={() =>
                        startEditSection(section)
                      }
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        toggleSection(section)
                      }
                    >
                      {section.is_active
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

      {/* ============================= */}
      {/* ACTIVITY FORM */}
      {/* ============================= */}

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
              <label>Activity Section *</label>

              <select
                value={form.section_id}
                onChange={(event) =>
                  updateField(
                    'section_id',
                    event.target.value
                      ? Number(event.target.value)
                      : ''
                  )
                }
                required
              >
                <option value="">
                  Select Activity Section
                </option>

                {sections
                  .filter((section) => section.is_active)
                  .map((section) => (
                    <option
                      key={section.id}
                      value={section.id}
                    >
                      {section.icon
                        ? `${section.icon} `
                        : ''}
                      {section.name}
                    </option>
                  ))}
              </select>
            </div>

            <div className="form-field">
              <label>Display Order</label>

              <input
                type="number"
                min="0"
                value={form.display_order}
                onChange={(event) =>
                  updateField(
                    'display_order',
                    Number(event.target.value)
                  )
                }
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
                onClick={() =>
                  setImageMode('url')
                }
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
                onClick={() =>
                  setImageMode('upload')
                }
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
              value={
                form.is_active
                  ? 'active'
                  : 'inactive'
              }
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

      {/* ============================= */}
      {/* ACTIVITIES LIST */}
      {/* ============================= */}

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

                  {activity.section_name && (
                    <span>
                      Section:{' '}
                      {activity.section_name}
                    </span>
                  )}

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
                    Display Order:{' '}
                    {activity.display_order}
                  </span>

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