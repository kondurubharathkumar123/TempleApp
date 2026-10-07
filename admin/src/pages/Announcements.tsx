import { useEffect, useState } from 'react';
import { apiRequest } from '../lib/api';

type Announcement = {
  id: number;
  title: string;
  message: string;
  image_url?: string | null;
  is_active: boolean;
  publish_at?: string | null;
  created_at?: string;
  updated_at?: string;
};

type AnnouncementForm = {
  title: string;
  message: string;
  image_url: string;
  publish_at: string;
  send_notification: boolean;
  is_active: boolean;
};

const emptyForm: AnnouncementForm = {
  title: '',
  message: '',
  image_url: '',
  publish_at: '',
  send_notification: false,
  is_active: true,
};

export default function Announcements() {
  const [items, setItems] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [form, setForm] = useState<AnnouncementForm>(emptyForm);

  const [saving, setSaving] = useState(false);
  const [actionId, setActionId] = useState<number | null>(null);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // ========================================
  // LOAD ANNOUNCEMENTS
  // ========================================

  async function loadAnnouncements() {
    try {
      setLoading(true);
      setError('');

      const result = await apiRequest<{
        success: boolean;
        data: Announcement[];
      }>('/admin/announcements');

      setItems(result.data || []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to load announcements'
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAnnouncements();
  }, []);

  // ========================================
  // FORM HELPERS
  // ========================================

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  }

  function openAddForm() {
    setError('');
    setSuccess('');
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  }

  function openEditForm(announcement: Announcement) {
    setError('');
    setSuccess('');

    setEditingId(announcement.id);

    setForm({
      title: announcement.title || '',
      message: announcement.message || '',
      image_url: announcement.image_url || '',
      publish_at: announcement.publish_at
        ? formatDateTimeLocal(announcement.publish_at)
        : '',
      send_notification: false,
      is_active: announcement.is_active,
    });

    setShowForm(true);
  }

  function formatDateTimeLocal(value: string) {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return '';
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  function formatDate(value?: string | null) {
    if (!value) {
      return 'Immediate';
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return '—';
    }

    return date.toLocaleString();
  }

  function updateField<K extends keyof AnnouncementForm>(
    field: K,
    value: AnnouncementForm[K]
  ) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  // ========================================
  // ADD / EDIT
  // ========================================

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    setError('');
    setSuccess('');

    if (!form.title.trim()) {
      setError('Announcement title is required.');
      return;
    }

    if (!form.message.trim()) {
      setError('Announcement message is required.');
      return;
    }

    try {
      setSaving(true);

      if (editingId === null) {
        const result = await apiRequest<{
          success: boolean;
          message: string;
          data: unknown;
        }>('/admin/announcements', {
          method: 'POST',
          body: JSON.stringify({
            title: form.title.trim(),
            message: form.message.trim(),
            image_url: form.image_url.trim() || null,
            is_active: form.is_active,
            publish_at: form.publish_at || null,
            send_notification:
              form.publish_at.trim() === ''
                ? form.send_notification
                : false,
          }),
        });

        setSuccess(
          result.message || 'Announcement created successfully.'
        );
      } else {
        const result = await apiRequest<{
          success: boolean;
          message: string;
          data: Announcement;
        }>(`/admin/announcements/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify({
            title: form.title.trim(),
            message: form.message.trim(),
            image_url: form.image_url.trim() || null,
            is_active: form.is_active,
            publish_at: form.publish_at || null,
          }),
        });

        setSuccess(
          result.message || 'Announcement updated successfully.'
        );
      }

      resetForm();
      await loadAnnouncements();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to save announcement'
      );
    } finally {
      setSaving(false);
    }
  }

  // ========================================
  // ACTIVATE / DEACTIVATE
  // ========================================

  async function handleToggleActive(announcement: Announcement) {
    const nextStatus = !announcement.is_active;

    const action = nextStatus ? 'activate' : 'deactivate';

    const confirmed = window.confirm(
      `Are you sure you want to ${action} "${announcement.title}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionId(announcement.id);
      setError('');
      setSuccess('');

      const result = await apiRequest<{
        success: boolean;
        message: string;
      }>(`/admin/announcements/${announcement.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          is_active: nextStatus,
        }),
      });

      setSuccess(
        result.message ||
          `Announcement ${nextStatus ? 'activated' : 'deactivated'} successfully.`
      );

      await loadAnnouncements();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : `Failed to ${action} announcement`
      );
    } finally {
      setActionId(null);
    }
  }

  // ========================================
  // SEND NOW
  // ========================================

  async function handleSendNow(announcement: Announcement) {
    if (!announcement.is_active) {
      setError(
        'Inactive announcements cannot be sent. Activate the announcement first.'
      );
      return;
    }

    const confirmed = window.confirm(
      `Send "${announcement.title}" notification to all devotees now?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionId(announcement.id);
      setError('');
      setSuccess('');

      const result = await apiRequest<{
        success: boolean;
        message: string;
        data?: unknown;
      }>(`/admin/announcements/${announcement.id}/send`, {
        method: 'POST',
      });

      if (!result.success) {
        throw new Error(
          result.message || 'Failed to send notification'
        );
      }

      setSuccess(
        result.message ||
          'Announcement notification sent successfully.'
      );

      await loadAnnouncements();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to send announcement notification'
      );
    } finally {
      setActionId(null);
    }
  }

  // ========================================
  // RENDER
  // ========================================

  return (
    <div className="page">
      {/* ========================================
          PAGE HEADER
          ======================================== */}

      <div className="page-header">
        <div>
          <h1>Announcements</h1>
          <p>
            Manage announcements and notifications sent to devotees
          </p>
        </div>

        <div
          style={{
            display: 'flex',
            gap: '10px',
            alignItems: 'center',
          }}
        >
          <button
            type="button"
            className="primary-button"
            onClick={loadAnnouncements}
            disabled={loading}
          >
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>

          <button
            type="button"
            className="primary-button"
            onClick={openAddForm}
          >
            Add Announcement
          </button>
        </div>
      </div>

      {/* ========================================
          SUCCESS / ERROR
          ======================================== */}

      {error && (
        <div
          className="error-message"
          style={{
            marginBottom: '16px',
          }}
        >
          {error}
        </div>
      )}

      {success && (
        <div
          style={{
            padding: '12px 16px',
            marginBottom: '16px',
            borderRadius: '8px',
            background: '#ecfdf3',
            color: '#166534',
            border: '1px solid #bbf7d0',
          }}
        >
          {success}
        </div>
      )}

      {/* ========================================
          ADD / EDIT FORM
          ======================================== */}

      {showForm && (
        <div
          className="card"
          style={{
            marginBottom: '20px',
          }}
        >
          <div className="section-header">
            <div>
              <h2>
                {editingId === null
                  ? 'Add Announcement'
                  : 'Edit Announcement'}
              </h2>

              <p>
                Create an announcement for temple devotees
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* TITLE */}

            <div style={{ marginBottom: '16px' }}>
              <label
                style={{
                  display: 'block',
                  fontWeight: 600,
                  marginBottom: '7px',
                }}
              >
                Title *
              </label>

              <input
                type="text"
                value={form.title}
                onChange={(event) =>
                  updateField('title', event.target.value)
                }
                placeholder="Example: Sri Temple Annual Festival"
                style={{
                  width: '100%',
                  padding: '11px 12px',
                  border: '1px solid #d9d1c7',
                  borderRadius: '8px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* MESSAGE */}

            <div style={{ marginBottom: '16px' }}>
              <label
                style={{
                  display: 'block',
                  fontWeight: 600,
                  marginBottom: '7px',
                }}
              >
                Message *
              </label>

              <textarea
                value={form.message}
                onChange={(event) =>
                  updateField('message', event.target.value)
                }
                placeholder="Enter announcement message..."
                rows={5}
                style={{
                  width: '100%',
                  padding: '11px 12px',
                  border: '1px solid #d9d1c7',
                  borderRadius: '8px',
                  fontSize: '14px',
                  resize: 'vertical',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* IMAGE URL */}

            <div style={{ marginBottom: '16px' }}>
              <label
                style={{
                  display: 'block',
                  fontWeight: 600,
                  marginBottom: '7px',
                }}
              >
                Image URL
                <span
                  style={{
                    fontWeight: 400,
                    color: '#81776d',
                    marginLeft: '6px',
                  }}
                >
                  Optional
                </span>
              </label>

              <input
                type="url"
                value={form.image_url}
                onChange={(event) =>
                  updateField('image_url', event.target.value)
                }
                placeholder="https://example.com/announcement.jpg"
                style={{
                  width: '100%',
                  padding: '11px 12px',
                  border: '1px solid #d9d1c7',
                  borderRadius: '8px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* SCHEDULE */}

            <div style={{ marginBottom: '16px' }}>
              <label
                style={{
                  display: 'block',
                  fontWeight: 600,
                  marginBottom: '7px',
                }}
              >
                Publish / Notification Time
                <span
                  style={{
                    fontWeight: 400,
                    color: '#81776d',
                    marginLeft: '6px',
                  }}
                >
                  Optional
                </span>
              </label>

              <input
                type="datetime-local"
                value={form.publish_at}
                onChange={(event) =>
                  updateField('publish_at', event.target.value)
                }
                style={{
                  padding: '11px 12px',
                  border: '1px solid #d9d1c7',
                  borderRadius: '8px',
                  fontSize: '14px',
                }}
              />

              <p
                style={{
                  marginTop: '6px',
                  fontSize: '12px',
                  color: '#81776d',
                }}
              >
                Leave empty if you want to keep the announcement
                without a scheduled notification.
              </p>
            </div>

            {/* ACTIVE */}

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '14px',
              }}
            >
              <input
                id="announcement-active"
                type="checkbox"
                checked={form.is_active}
                onChange={(event) =>
                  updateField(
                    'is_active',
                    event.target.checked
                  )
                }
              />

              <label htmlFor="announcement-active">
                Active announcement
              </label>
            </div>

            {/* SEND NOTIFICATION */}

            {editingId === null && !form.publish_at && (
              <div
                style={{
                  padding: '12px 14px',
                  borderRadius: '8px',
                  background: '#fff8ef',
                  border: '1px solid #ead8c3',
                  marginBottom: '20px',
                }}
              >
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontWeight: 600,
                  }}
                >
                  <input
                    type="checkbox"
                    checked={form.send_notification}
                    onChange={(event) =>
                      updateField(
                        'send_notification',
                        event.target.checked
                      )
                    }
                  />

                  Send notification to all devotees now
                </label>

                <p
                  style={{
                    margin:
                      '6px 0 0 26px',
                    fontSize: '12px',
                    color: '#81776d',
                  }}
                >
                  The announcement will be created and a push
                  notification will be sent immediately.
                </p>
              </div>
            )}

            {form.publish_at && editingId === null && (
              <div
                style={{
                  padding: '12px 14px',
                  borderRadius: '8px',
                  background: '#eff6ff',
                  border: '1px solid #bfdbfe',
                  marginBottom: '20px',
                  fontSize: '13px',
                  color: '#1e40af',
                }}
              >
                This announcement will be scheduled for the selected
                date and time. The notification will be sent
                automatically by the backend scheduler.
              </div>
            )}

            {/* FORM BUTTONS */}

            <div
              style={{
                display: 'flex',
                gap: '10px',
                justifyContent: 'flex-end',
              }}
            >
              <button
                type="button"
                onClick={resetForm}
                disabled={saving}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="primary-button"
                disabled={saving}
              >
                {saving
                  ? 'Saving...'
                  : editingId === null
                  ? 'Create Announcement'
                  : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================
          ANNOUNCEMENT LIST
          ======================================== */}

      <div className="card">
        <div className="section-header">
          <div>
            <h2>Temple Announcements</h2>

            <p>
              Announcements displayed to devotees
            </p>
          </div>
        </div>

        {loading && items.length === 0 ? (
          <p>Loading announcements...</p>
        ) : items.length === 0 ? (
          <p>No announcements found.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Announcement</th>
                  <th>Publish At</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {items.map((announcement) => {
                  const busy =
                    actionId === announcement.id;

                  return (
                    <tr key={announcement.id}>
                      {/* ANNOUNCEMENT */}

                      <td>
                        <strong>
                          {announcement.title}
                        </strong>

                        <small
                          style={{
                            display: 'block',
                            marginTop: '4px',
                            color: '#81776d',
                            maxWidth: '450px',
                          }}
                        >
                          {announcement.message}
                        </small>

                        {announcement.image_url && (
                          <small
                            style={{
                              display: 'block',
                              marginTop: '5px',
                              color: '#a45a20',
                            }}
                          >
                            Image attached
                          </small>
                        )}
                      </td>

                      {/* PUBLISH */}

                      <td>
                        {formatDate(
                          announcement.publish_at
                        )}
                      </td>

                      {/* STATUS */}

                      <td>
                        <span
                          className="badge"
                          style={{
                            display: 'inline-block',
                            padding: '5px 9px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            background:
                              announcement.is_active
                                ? '#eaf7ee'
                                : '#f3f4f6',
                            color:
                              announcement.is_active
                                ? '#166534'
                                : '#6b7280',
                          }}
                        >
                          {announcement.is_active
                            ? 'Active'
                            : 'Inactive'}
                        </span>
                      </td>

                      {/* ACTIONS */}

                      <td>
                        <div
                          style={{
                            display: 'flex',
                            gap: '8px',
                            flexWrap: 'wrap',
                          }}
                        >
                          {/* EDIT */}

                          <button
                            type="button"
                            onClick={() =>
                              openEditForm(
                                announcement
                              )
                            }
                            disabled={busy}
                          >
                            Edit
                          </button>

                          {/* ACTIVATE / DEACTIVATE */}

                          <button
                            type="button"
                            onClick={() =>
                              handleToggleActive(
                                announcement
                              )
                            }
                            disabled={busy}
                          >
                            {busy
                              ? 'Please wait...'
                              : announcement.is_active
                              ? 'Deactivate'
                              : 'Activate'}
                          </button>

                          {/* SEND NOW */}

                          <button
                            type="button"
                            onClick={() =>
                              handleSendNow(
                                announcement
                              )
                            }
                            disabled={
                              busy ||
                              !announcement.is_active
                            }
                          >
                            Send Now
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}