# Temple Admin Web

Admin web foundation for the Temple App. It uses React + TypeScript + Vite and the existing Express/PostgreSQL backend.

## Run

From this folder:

```bash
npm install
npm run dev
```

The default admin URL is `http://localhost:5173` and the API defaults to `http://localhost:5000/api`.

To override the API URL, create `admin/.env`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## Current integration

- Admin login through `/api/auth/login`
- Admin-only access using the existing JWT middleware
- Dashboard summary through `/api/admin/dashboard`
- Deity CRUD through `/api/admin/deities`
- Gallery CRUD through `/api/admin/gallery`
- Deactivation uses `is_active = false` so existing mobile queries continue to work

Images are currently entered as image URLs. Cloudinary upload can be added in the media-integration step without changing the mobile contract.
