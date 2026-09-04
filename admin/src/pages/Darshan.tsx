import { useEffect, useState } from 'react';
import { apiRequest } from '../lib/api';

type DarshanSlot = {
  id: number;
  name: string;
  description?: string;
  darshan_date: string;
  start_time: string;
  end_time: string;
  price: string | number;
  capacity: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
};

export default function Darshan() {
  const [items, setItems] = useState<DarshanSlot[]>([]);
  const [editing, setEditing] =
    useState<Partial<DarshanSlot> | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function loadDarshan() {
    try {
      setLoading(true);
      setError('');

      const result = await apiRequest<{
        success: boolean;
        data: DarshanSlot[];
      }>('/admin/darshan');

      setItems(result.data || []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to load Darshan slots'
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDarshan();
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();

    if (
      !editing?.name ||
      !editing.darshan_date ||
      !editing.start_time ||
      !editing.end_time ||
      editing.price === undefined ||
      editing.capacity === undefined
    ) {
      setError(
        'Please fill all required Darshan fields.'
      );
      return;
    }

    try {
      setError('');

      const method = editing.id ? 'PUT' : 'POST';

      const endpoint = editing.id
        ? `/admin/darshan/${editing.id}`
        : '/admin/darshan';

      await apiRequest(endpoint, {
        method,
        body: JSON.stringify({
          name: editing.name,
          description:
            editing.description || null,
          darshan_date:
            editing.darshan_date,
          start_time:
            editing.start_time,
          end_time:
            editing.end_time,
          price:
            Number(editing.price),
          capacity:
            Number(editing.capacity),
          is_active:
            editing.is_active !== undefined
              ? editing.is_active
              : true,
        }),
      });

      setEditing(null);
      await loadDarshan();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to save Darshan slot'
      );
    }
  }

  async function toggleStatus(
    item: DarshanSlot
  ) {
    try {
      setError('');

      await apiRequest(
        `/admin/darshan/${item.id}/status`,
        {
          method: 'PATCH',
          body: JSON.stringify({
            is_active: !item.is_active,
          }),
        }
      );

      await loadDarshan();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to update Darshan status'
      );
    }
  }

  function formatDate(value?: string) {
    if (!value) return '—';

    return value.substring(0, 10);
  }

  function formatTime(value?: string) {
    if (!value) return '—';

    return value.substring(0, 5);
  }

  function formatAmount(
    value?: string | number
  ) {
    if (
      value === undefined ||
      value === null
    ) {
      return '—';
    }

    return `₹${Number(value).toLocaleString(
      'en-IN'
    )}`;
  }

  return (
    <Page
      title="Darshan"
      subtitle="Manage Darshan slots displayed in the devotee app"
      action={
        <button
          type="button"
          className="primary"
          onClick={() =>
            setEditing({
              is_active: true,
              price: 0,
              capacity: 1,
            })
          }
        >
          + Add Darshan
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
              ? 'Edit Darshan'
              : 'Add Darshan'}
          </h3>

          <div className="grid2">
            <label>
              Darshan Name

              <input
                value={
                  editing.name || ''
                }
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    name:
                      e.target.value,
                  })
                }
                placeholder="Morning Darshan"
                required
              />
            </label>

            <label>
              Date

              <input
                type="date"
                value={
                  editing.darshan_date ||
                  ''
                }
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    darshan_date:
                      e.target.value,
                  })
                }
                required
              />
            </label>

            <label>
              Start Time

              <input
                type="time"
                value={
                  editing.start_time ||
                  ''
                }
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    start_time:
                      e.target.value,
                  })
                }
                required
              />
            </label>

            <label>
              End Time

              <input
                type="time"
                value={
                  editing.end_time ||
                  ''
                }
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    end_time:
                      e.target.value,
                  })
                }
                required
              />
            </label>

            <label>
              Price

              <input
                type="number"
                min="0"
                step="0.01"
                value={
                  editing.price ??
                  ''
                }
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    price:
                      e.target.value,
                  })
                }
                required
              />
            </label>

            <label>
              Capacity

              <input
                type="number"
                min="1"
                step="1"
                value={
                  editing.capacity ??
                  ''
                }
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    capacity:
                      Number(
                        e.target.value
                      ),
                  })
                }
                required
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
              placeholder="Describe this Darshan slot"
            />
          </label>

          <label>
            Status

            <select
              value={
                editing.is_active
                  ? 'active'
                  : 'inactive'
              }
              onChange={(e) =>
                setEditing({
                  ...editing,
                  is_active:
                    e.target.value ===
                    'active',
                })
              }
            >
              <option value="active">
                Active
              </option>

              <option value="inactive">
                Inactive
              </option>
            </select>
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
              {editing.id
                ? 'Update Darshan'
                : 'Save Darshan'}
            </button>
          </div>
        </form>
      )}

      <div className="card">
        <div className="section-header">
          <div>
            <h2>Darshan Slots</h2>

            <p>
              Existing Darshan slots from
              the backend
            </p>
          </div>

          <button
            type="button"
            onClick={loadDarshan}
            disabled={loading}
          >
            {loading
              ? 'Refreshing...'
              : 'Refresh'}
          </button>
        </div>

        {loading && items.length === 0 ? (
          <p>
            Loading Darshan slots...
          </p>
        ) : items.length === 0 ? (
          <p>
            No Darshan slots found.
          </p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Price</th>
                  <th>Capacity</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <strong>
                        {item.name}
                      </strong>

                      {item.description && (
                        <small
                          style={{
                            display:
                              'block',
                            marginTop:
                              '4px',
                            color:
                              '#81776d',
                          }}
                        >
                          {
                            item.description
                          }
                        </small>
                      )}
                    </td>

                    <td>
                      {formatDate(
                        item.darshan_date
                      )}
                    </td>

                    <td>
                      {formatTime(
                        item.start_time
                      )}
                      {' – '}
                      {formatTime(
                        item.end_time
                      )}
                    </td>

                    <td>
                      {formatAmount(
                        item.price
                      )}
                    </td>

                    <td>
                      {item.capacity}
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
                          setEditing(
                            item
                          )
                        }
                      >
                        Edit
                      </button>{' '}

                      <button
                        type="button"
                        className={
                          item.is_active
                            ? 'danger'
                            : ''
                        }
                        onClick={() =>
                          toggleStatus(
                            item
                          )
                        }
                      >
                        {item.is_active
                          ? 'Deactivate'
                          : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
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