import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';

import { apiRequest, clearAdminSession } from './lib/api';

import Activities from './pages/Activities';
import Users from './pages/Users';
import Rooms from './pages/Rooms';
import Bookings from './pages/Bookings';
import RoomBookings from './pages/RoomBookings';
import Events from './pages/Events';
import Darshan from './pages/Darshan'

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
      !confirm(
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
  const [items, setItems] =
    useState<Gallery[]>([]);

  const [editing, setEditing] =
    useState<
      Partial<Gallery> | null
    >(null);

  const [error, setError] =
    useState('');

  const load = () =>
    apiRequest<{ data: Gallery[] }>(
      '/admin/gallery'
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

    if (
      !editing?.title ||
      !editing.image_url
    ) {
      return;
    }

    try {
      const method = editing.id
        ? 'PUT'
        : 'POST';

      await apiRequest(
        editing.id
          ? `/admin/gallery/${editing.id}`
          : '/admin/gallery',
        {
          method,
          body: JSON.stringify(
            editing
          ),
        }
      );

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
      !confirm(
        'Deactivate this gallery item?'
      )
    ) {
      return;
    }

    try {
      await apiRequest(
        `/admin/gallery/${id}`,
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
      title="Gallery"
      subtitle="Manage images shown in the devotee app"
      action={
        <button
          className="primary"
          onClick={() =>
            setEditing({
              is_active: true,
            })
          }
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

      {editing && (
        <form
          className="form-card"
          onSubmit={save}
        >
          <h3>
            {editing.id
              ? 'Edit'
              : 'Add'}{' '}
            Gallery Image
          </h3>

          <div className="grid2">
            <label>
              Title

              <input
                value={
                  editing.title || ''
                }
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    title: e.target.value,
                  })
                }
                required
              />
            </label>

            <label>
              Category

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
              />
            </label>
          </div>

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
              required
            />
          </label>

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

          {editing.image_url && (
            <img
              className="preview"
              src={editing.image_url}
              alt={editing.title || 'Gallery preview'}
            />
          )}

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
              Save Image
            </button>
          </div>
        </form>
      )}

      <div className="gallery-grid">
        {items.map((x) => (
          <div
            className="gallery-card"
            key={x.id}
          >
            {x.image_url ? (
              <img
                src={x.image_url}
                alt={x.title}
              />
            ) : (
              <div className="gallery-empty">
                No image
              </div>
            )}

            <div className="gallery-body">
              <strong>
                {x.title}
              </strong>

              <span>
                {x.category ||
                  'Uncategorized'}
              </span>

              <div className="actions">
                <button
                  type="button"
                  onClick={() =>
                    setEditing(x)
                  }
                >
                  Edit
                </button>

                <button
                  type="button"
                  className="danger"
                  onClick={() =>
                    remove(x.id)
                  }
                >
                  Deactivate
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

      {/* SIDEBAR */}
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

      {/* PAGES */}

    {page === 'dashboard' && <Dashboard />}

{page === 'deities' && <Deities />}

{page === 'activities' && <Activities />}

{page === 'gallery' && <Gallery />}

{page === 'users' && <Users />}

{page === 'bookings' && <Bookings />}

{page === 'rooms' && <Rooms />}



{page === 'room-bookings' && <RoomBookings />}

{page === 'events' && <Events />}
{page === 'darshan' && <Darshan />}

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