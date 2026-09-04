import { useEffect, useState } from 'react';
import { apiRequest } from '../lib/api';

type EventItem = {
  id: number;
  title: string;
  description?: string;
  image_url?: string;
  event_date?: string;
  start_time?: string;
  end_time?: string;
  location?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
};

export default function Events() {
  const [items, setItems] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] =
    useState<EventItem | null>(null);

  async function loadEvents() {
    try {
      setLoading(true);
      setError('');

      const result = await apiRequest<{
        success: boolean;
        data: EventItem[];
      }>('/admin/events');

      setItems(result.data || []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to load events'
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEvents();
  }, []);

  function formatDate(value?: string) {
    if (!value) return '—';

    return value.substring(0, 10);
  }

  function formatTime(value?: string) {
    if (!value) return '—';

    return value.substring(0, 5);
  }

  function openAddForm() {
    setEditingEvent(null);
    setShowForm(true);
  }

  function openEditForm(event: EventItem) {
    setEditingEvent(event);
    setShowForm(true);
  }

  async function toggleStatus(event: EventItem) {
    try {
      setError('');

      await apiRequest(
        `/admin/events/${event.id}/status`,
        {
          method: 'PATCH',
          body: JSON.stringify({
            is_active: !event.is_active,
          }),
        }
      );

      await loadEvents();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to update event status'
      );
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Events</h1>

          <p>
            Manage temple events displayed to devotees
          </p>
        </div>

        <div
          style={{
            display: 'flex',
            gap: '10px',
          }}
        >
          <button
            type="button"
            className="primary-button"
            onClick={loadEvents}
            disabled={loading}
          >
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>

          <button
            type="button"
            className="primary-button"
            onClick={openAddForm}
          >
            Add Event
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {showForm && (
        <EventForm
          event={editingEvent}
          onClose={() => setShowForm(false)}
          onSaved={() => {
            setShowForm(false);
            loadEvents();
          }}
        />
      )}

      <div className="card">
        <div className="section-header">
          <div>
            <h2>Temple Events</h2>

            <p>
              Events managed from the admin dashboard
            </p>
          </div>
        </div>

        {loading && items.length === 0 ? (
          <p>Loading events...</p>
        ) : items.length === 0 ? (
          <p>No events found.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Event</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {items.map((event) => (
                  <tr key={event.id}>
                    <td>
                      <strong>
                        {event.title}
                      </strong>

                      {event.description && (
                        <small
                          style={{
                            display: 'block',
                            marginTop: '4px',
                            color: '#81776d',
                            maxWidth: '300px',
                          }}
                        >
                          {event.description}
                        </small>
                      )}
                    </td>

                    <td>
                      {formatDate(event.event_date)}
                    </td>

                    <td>
                      {formatTime(event.start_time)}
                      {' – '}
                      {formatTime(event.end_time)}
                    </td>

                    <td>
                      {event.location || '—'}
                    </td>

                    <td>
                      <span className="badge">
                        {event.is_active
                          ? 'active'
                          : 'inactive'}
                      </span>
                    </td>

                    <td>
                      <div
                        style={{
                          display: 'flex',
                          gap: '8px',
                        }}
                      >
                        <button
                          type="button"
                          onClick={() =>
                            openEditForm(event)
                          }
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            toggleStatus(event)
                          }
                        >
                          {event.is_active
                            ? 'Deactivate'
                            : 'Activate'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}


/* =========================================================
   EVENT FORM
========================================================= */

function EventForm({
  event,
  onClose,
  onSaved,
}: {
  event: EventItem | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [title, setTitle] = useState(
    event?.title || ''
  );

  const [description, setDescription] = useState(
    event?.description || ''
  );

  const [imageUrl, setImageUrl] = useState(
    event?.image_url || ''
  );

  const [eventDate, setEventDate] = useState(
    event?.event_date
      ? event.event_date.substring(0, 10)
      : ''
  );

  const [startTime, setStartTime] = useState(
    event?.start_time
      ? event.start_time.substring(0, 5)
      : ''
  );

  const [endTime, setEndTime] = useState(
    event?.end_time
      ? event.end_time.substring(0, 5)
      : ''
  );

  const [location, setLocation] = useState(
    event?.location || ''
  );

  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    try {
      setSaving(true);
      setFormError('');

      if (!title.trim()) {
        setFormError('Event title is required');
        return;
      }

      if (!eventDate) {
        setFormError('Event date is required');
        return;
      }

      const payload = {
        title: title.trim(),
        description: description.trim() || null,
        image_url: imageUrl.trim() || null,
        event_date: eventDate,
        start_time: startTime || null,
        end_time: endTime || null,
        location: location.trim() || null,
      };

      if (event) {
        await apiRequest(
          `/admin/events/${event.id}`,
          {
            method: 'PUT',
            body: JSON.stringify(payload),
          }
        );
      } else {
        await apiRequest(
          '/admin/events',
          {
            method: 'POST',
            body: JSON.stringify(payload),
          }
        );
      }

      onSaved();
    } catch (err) {
      setFormError(
        err instanceof Error
          ? err.message
          : 'Failed to save event'
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="card"
      style={{ marginBottom: '20px' }}
    >
      <div className="section-header">
        <div>
          <h2>
            {event ? 'Edit Event' : 'Add Event'}
          </h2>

          <p>
            {event
              ? 'Update temple event details'
              : 'Create a new temple event'}
          </p>
        </div>
      </div>

      {formError && (
        <div className="error-message">
          {formError}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(2, minmax(0, 1fr))',
            gap: '16px',
          }}
        >
          <label>
            Title
            <input
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              placeholder="Temple Festival"
            />
          </label>

          <label>
            Event Date
            <input
              type="date"
              value={eventDate}
              onChange={(e) =>
                setEventDate(e.target.value)
              }
            />
          </label>

          <label>
            Start Time
            <input
              type="time"
              value={startTime}
              onChange={(e) =>
                setStartTime(e.target.value)
              }
            />
          </label>

          <label>
            End Time
            <input
              type="time"
              value={endTime}
              onChange={(e) =>
                setEndTime(e.target.value)
              }
            />
          </label>

          <label>
            Location
            <input
              value={location}
              onChange={(e) =>
                setLocation(e.target.value)
              }
              placeholder="Temple Main Hall"
            />
          </label>

          <label>
            Image URL
            <input
              value={imageUrl}
              onChange={(e) =>
                setImageUrl(e.target.value)
              }
              placeholder="https://..."
            />
          </label>

          <label
            style={{
              gridColumn: '1 / -1',
            }}
          >
            Description
            <textarea
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              placeholder="Event description"
              rows={4}
            />
          </label>
        </div>

        <div
          style={{
            display: 'flex',
            gap: '10px',
            marginTop: '20px',
          }}
        >
          <button
            type="submit"
            className="primary-button"
            disabled={saving}
          >
            {saving
              ? 'Saving...'
              : event
              ? 'Update Event'
              : 'Create Event'}
          </button>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}