import { FormEvent, useEffect, useState } from 'react';
import { apiRequest } from '../lib/api';

type RoomType = {
  id: number;
  name: string;
  description?: string;
  capacity?: number;
  price_per_night?: string | number;
  image_url?: string;
  is_active?: boolean;
};

type Building = {
  id: number;
  name: string;
  code?: string;
  description?: string;
  is_active?: boolean;
};

type Room = {
  id: number;
  room_number?: string;

  room_type_id?: number;
  room_type_name?: string;

  building_id?: number;
  building_name?: string;
  building_code?: string;

  description?: string;
  capacity?: number;
  price_per_night?: string | number;

  status?: string;

  created_at?: string;
  updated_at?: string;
};

type RoomForm = {
  room_number: string;
  building_id: string;
  room_type_id: string;
  status: string;
};

const emptyForm: RoomForm = {
  room_number: '',
  building_id: '',
  room_type_id: '',
  status: 'available',
};

export default function Rooms() {
  const [items, setItems] = useState<Room[]>([]);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [buildings, setBuildings] = useState<Building[]>([]);

  const [form, setForm] = useState<RoomForm>(emptyForm);

  const [editing, setEditing] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [loadingTypes, setLoadingTypes] = useState(false);
  const [loadingBuildings, setLoadingBuildings] =
    useState(false);

  const [error, setError] = useState('');

  /*
   * Load rooms
   */
  async function loadRooms() {
    try {
      setLoading(true);
      setError('');

      const result = await apiRequest<{
        success: boolean;
        data: Room[];
      }>('/admin/rooms');

      setItems(result.data || []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to load rooms'
      );
    } finally {
      setLoading(false);
    }
  }

  /*
   * Load room types
   */
  async function loadRoomTypes() {
    try {
      setLoadingTypes(true);

      const result = await apiRequest<{
        success: boolean;
        data: RoomType[];
      }>('/rooms/types');

      setRoomTypes(result.data || []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to load room types'
      );
    } finally {
      setLoadingTypes(false);
    }
  }

  /*
   * Load buildings
   */
  async function loadBuildings() {
    try {
      setLoadingBuildings(true);

      const result = await apiRequest<{
        success: boolean;
        data: Building[];
      }>('/admin/buildings');

      setBuildings(result.data || []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to load buildings'
      );
    } finally {
      setLoadingBuildings(false);
    }
  }

  /*
   * Initial load
   */
  useEffect(() => {
    loadRooms();
    loadRoomTypes();
    loadBuildings();
  }, []);

  /*
   * Update form field
   */
  function updateField(
    field: keyof RoomForm,
    value: string
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  /*
   * Add room
   */
  function startAdd() {
    setEditing(null);
    setForm(emptyForm);
    setShowForm(true);
    setError('');

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  /*
   * Edit room
   */
  function startEdit(room: Room) {
    setEditing(room.id);

    setForm({
      room_number: room.room_number || '',

      building_id:
        room.building_id !== undefined
          ? String(room.building_id)
          : '',

      room_type_id:
        room.room_type_id !== undefined
          ? String(room.room_type_id)
          : '',

      status: room.status || 'available',
    });

    setShowForm(true);
    setError('');

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  /*
   * Cancel form
   */
  function cancelForm() {
    setEditing(null);
    setForm(emptyForm);
    setShowForm(false);
    setError('');
  }

  /*
   * Submit room
   */
  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    setError('');

    /*
     * Validate room number
     */
    if (!form.room_number.trim()) {
      setError('Room number is required.');
      return;
    }

    /*
     * Validate building
     */
    if (!form.building_id) {
      setError('Please select a building.');
      return;
    }

    /*
     * Validate room type
     */
    if (!form.room_type_id) {
      setError('Please select a room type.');
      return;
    }

    try {
      setLoading(true);

      /*
       * This matches the PostgreSQL rooms table:
       *
       * room_number
       * room_type_id
       * building_id
       * status
       */
      const body = {
        room_number: form.room_number.trim(),
        room_type_id: Number(form.room_type_id),
        building_id: Number(form.building_id),
        status: form.status,
      };

      if (editing !== null) {
        await apiRequest(
          `/admin/rooms/${editing}`,
          {
            method: 'PUT',
            body: JSON.stringify(body),
          }
        );
      } else {
        await apiRequest(
          '/admin/rooms',
          {
            method: 'POST',
            body: JSON.stringify(body),
          }
        );
      }

      await loadRooms();

      cancelForm();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to save room'
      );
    } finally {
      setLoading(false);
    }
  }

  /*
   * Format price
   */
  function formatPrice(
    price?: string | number
  ) {
    if (price === undefined || price === null) {
      return '—';
    }

    const value = Number(price);

    if (Number.isNaN(value)) {
      return '—';
    }

    return `₹${value.toLocaleString('en-IN')}`;
  }

  /*
   * Refresh everything
   */
  async function handleRefresh() {
    await Promise.all([
      loadRooms(),
      loadRoomTypes(),
      loadBuildings(),
    ]);
  }

  /*
   * Selected room type
   */
  const selectedRoomType = form.room_type_id
    ? roomTypes.find(
        (type) =>
          type.id === Number(form.room_type_id)
      )
    : undefined;

  return (
    <div className="page">

      {/* PAGE HEADER */}
      <div className="page-header">

        <div>
          <h1>Rooms</h1>

          <p>
            Manage temple accommodation rooms
          </p>
        </div>

        <div className="actions">

          <button
            type="button"
            className="secondary-button"
            onClick={handleRefresh}
            disabled={
              loading ||
              loadingTypes ||
              loadingBuildings
            }
          >
            {loading ||
            loadingTypes ||
            loadingBuildings
              ? 'Refreshing...'
              : 'Refresh'}
          </button>

          <button
            type="button"
            className="primary-button"
            onClick={startAdd}
          >
            + Add Room
          </button>

        </div>
      </div>

      {/* ERROR */}
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* ADD / EDIT FORM */}
      {showForm && (
        <div className="card">

          <h2>
            {editing !== null
              ? 'Edit Room'
              : 'Add Room'}
          </h2>

          <form onSubmit={handleSubmit}>

            <div className="form-grid">

              {/* ROOM NUMBER */}
              <div className="form-field">

                <label>
                  Room Number *
                </label>

                <input
                  type="text"
                  value={form.room_number}
                  onChange={(event) =>
                    updateField(
                      'room_number',
                      event.target.value
                    )
                  }
                  placeholder="Example: 101"
                  required
                />

              </div>

              {/* BUILDING */}
              <div className="form-field">

                <label>
                  Building *
                </label>

                <select
                  value={form.building_id}
                  onChange={(event) =>
                    updateField(
                      'building_id',
                      event.target.value
                    )
                  }
                  required
                >

                  <option value="">
                    {loadingBuildings
                      ? 'Loading buildings...'
                      : 'Select building'}
                  </option>

                  {buildings.map((building) => (
                    <option
                      key={building.id}
                      value={building.id}
                    >
                      {building.name}
                      {building.code
                        ? ` (${building.code})`
                        : ''}
                    </option>
                  ))}

                </select>

                {!loadingBuildings &&
                  buildings.length === 0 && (
                    <small className="field-help">
                      No active buildings found.
                      Create a building first.
                    </small>
                  )}

              </div>

              {/* ROOM TYPE */}
              <div className="form-field">

                <label>
                  Room Type *
                </label>

                <select
                  value={form.room_type_id}
                  onChange={(event) =>
                    updateField(
                      'room_type_id',
                      event.target.value
                    )
                  }
                  required
                >

                  <option value="">
                    {loadingTypes
                      ? 'Loading room types...'
                      : 'Select room type'}
                  </option>

                  {roomTypes.map((type) => (
                    <option
                      key={type.id}
                      value={type.id}
                    >
                      {type.name}
                    </option>
                  ))}

                </select>

                {!loadingTypes &&
                  roomTypes.length === 0 && (
                    <small className="field-help">
                      No active room types found.
                      Create a room type first.
                    </small>
                  )}

              </div>

              {/* STATUS */}
              <div className="form-field">

                <label>
                  Status
                </label>

                <select
                  value={form.status}
                  onChange={(event) =>
                    updateField(
                      'status',
                      event.target.value
                    )
                  }
                >

                  <option value="available">
                    Available
                  </option>

                  <option value="maintenance">
                    Maintenance
                  </option>

                  <option value="unavailable">
                    Unavailable
                  </option>

                </select>

              </div>

            </div>

            {/* SELECTED ROOM TYPE DETAILS */}
            {selectedRoomType && (
              <div className="room-type-preview">

                <h3>
                  Room Type Details
                </h3>

                <div className="room-type-details">

                  <div>
                    <span>
                      Type
                    </span>

                    <strong>
                      {selectedRoomType.name}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Capacity
                    </span>

                    <strong>
                      {selectedRoomType.capacity ??
                        '—'}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Price / Night
                    </span>

                    <strong>
                      {formatPrice(
                        selectedRoomType.price_per_night
                      )}
                    </strong>
                  </div>

                </div>

                {selectedRoomType.description && (
                  <p>
                    {selectedRoomType.description}
                  </p>
                )}

              </div>
            )}

            {/* FORM ACTIONS */}
            <div className="form-actions">

              <button
                type="button"
                className="secondary-button"
                onClick={cancelForm}
                disabled={loading}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="primary-button"
                disabled={
                  loading ||
                  loadingTypes ||
                  loadingBuildings ||
                  roomTypes.length === 0 ||
                  buildings.length === 0
                }
              >
                {loading
                  ? 'Saving...'
                  : editing !== null
                  ? 'Update Room'
                  : 'Add Room'}
              </button>

            </div>

          </form>

        </div>
      )}

      {/* ROOMS LIST */}
      <div className="card">

        <div className="section-header">

          <div>
            <h2>
              Rooms
            </h2>

            <p>
              Existing rooms from the backend
            </p>
          </div>

        </div>

        {/* LOADING */}
        {loading && items.length === 0 ? (

          <p>
            Loading rooms...
          </p>

        ) : items.length === 0 ? (

          <p>
            No rooms found.
          </p>

        ) : (

          <div className="table-wrap">

            <table>

              <thead>

                <tr>

                  <th>
                    Room
                  </th>

                  <th>
                    Building
                  </th>

                  <th>
                    Room Type
                  </th>

                  <th>
                    Capacity
                  </th>

                  <th>
                    Price / Night
                  </th>

                  <th>
                    Status
                  </th>

                  <th>
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody>

                {items.map((room) => (

                  <tr key={room.id}>

                    {/* ROOM NUMBER */}
                    <td>
                      <strong>
                        {room.room_number ||
                          `#${room.id}`}
                      </strong>
                    </td>

                    {/* BUILDING */}
                    <td>
                      {room.building_name ||
                        room.building_code ||
                        '—'}
                    </td>

                    {/* ROOM TYPE */}
                    <td>
                      {room.room_type_name ||
                        '—'}
                    </td>

                    {/* CAPACITY */}
                    <td>
                      {room.capacity ??
                        '—'}
                    </td>

                    {/* PRICE */}
                    <td>
                      {formatPrice(
                        room.price_per_night
                      )}
                    </td>

                    {/* STATUS */}
                    <td>

                      <span
                        className={
                          room.status ===
                          'available'
                            ? 'badge'
                            : room.status ===
                              'maintenance'
                            ? 'badge badge-warning'
                            : 'badge badge-danger'
                        }
                      >
                        {room.status ||
                          'Unknown'}
                      </span>

                    </td>

                    {/* ACTION */}
                    <td>

                      <button
                        type="button"
                        className="table-action-button"
                        onClick={() =>
                          startEdit(room)
                        }
                      >
                        Edit
                      </button>

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