import { useEffect, useState } from 'react';
import { apiRequest } from '../lib/api';

type User = {
  id: number;
  full_name: string;
  email: string;
  phone?: string;
  role: string;
  created_at?: string;
  updated_at?: string;
};

export default function Users() {
  const [items, setItems] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function loadUsers() {
    try {
      setLoading(true);
      setError('');

      const result = await apiRequest<{
        success: boolean;
        data: User[];
      }>('/admin/users');

      setItems(result.data || []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to load users'
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Users</h1>
          <p>Manage registered devotees and admin users</p>
        </div>

        <button
          type="button"
          className="primary-button"
          onClick={loadUsers}
          disabled={loading}
        >
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="card">
        <div className="section-header">
          <div>
            <h2>Registered Users</h2>
            <p>
              Existing users from the backend
            </p>
          </div>
        </div>

        {loading && items.length === 0 ? (
          <p>Loading users...</p>
        ) : items.length === 0 ? (
          <p>No users found.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Created</th>
                </tr>
              </thead>

              <tbody>
                {items.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>

                    <td>
                      <strong>
                        {user.full_name}
                      </strong>
                    </td>

                    <td>
                      {user.email}
                    </td>

                    <td>
                      {user.phone || '—'}
                    </td>

                    <td>
                      <span className="badge">
                        {user.role}
                      </span>
                    </td>

                    <td>
                      {user.created_at
                        ? user.created_at.substring(0, 10)
                        : '—'}
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