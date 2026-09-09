import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { checkRoomAvailability } from './controllers/roomBookingController';
import { pool } from './db';
import activityRoutes from './routes/activityRoutes';
import adminRoutes from './routes/adminRoutes';
import adminActivityRoutes from './routes/adminActivityRoutes';
import adminContentRoutes from './routes/adminContentRoutes';
import authRoutes from './routes/authRoutes';
import buildingRoutes from './routes/buildingRoutes';
import deityRoutes from './routes/deityRoutes';
import eventRoutes from './routes/eventRoutes';
import galleryRoutes from './routes/galleryRoutes';
import publicationRoutes from './routes/publicationRoutes';
import roomBookingRoutes from './routes/roomBookingRoutes';
import roomRoutes from './routes/roomRoutes';
import serviceBookingRoutes from './routes/serviceBookingRoutes';
import sevaRoutes from './routes/sevaRoutes';
import adminRoomBookingRoutes from './routes/adminRoomBookingRoutes';
import adminDarshanRoutes from './routes/adminDarshanRoutes';
import darshanRoutes from './routes/darshanRoutes';
dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 5000;

app.use(cors());
app.use(express.json());
app.use(
  '/uploads',
  express.static('uploads')
);

app.use('/api/deities', deityRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/darshan', darshanRoutes);
app.use('/api/admin', adminContentRoutes);
app.use('/api/admin/darshan', adminDarshanRoutes);
app.use('/api/admin/activities', adminActivityRoutes);
app.use(
  '/api/admin/room-bookings',
  adminRoomBookingRoutes
);

app.use('/api/sevas', sevaRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/publications', publicationRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/room-bookings', roomBookingRoutes);
app.use('/api/buildings', buildingRoutes);
app.use('/api/service-bookings', serviceBookingRoutes);
app.use('/api/auth', authRoutes);

app.get(
  '/api/rooms/:roomId/availability',
  checkRoomAvailability
);

app.use('/api/room-bookings', roomBookingRoutes);

app.get('/', (_req, res) => {
  res.json({
    success: true,
    message: 'Temple App Backend API is running',
  });
});

app.get('/api/health', async (_req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');

    res.json({
      success: true,
      message: 'Backend and PostgreSQL are connected',
      databaseTime: result.rows[0].now,
    });
  } catch (error) {
    console.error('Database connection error:', error);

    res.status(500).json({
      success: false,
      message: 'Database connection failed',
    });
  }
});

/* ================================
   ANDROID EMULATOR
   ================================
   
app.listen(PORT, () => {
  console.log(`Temple App Backend running on port ${PORT}`);
});
*/

/* ================================
   IPHONE / PHYSICAL DEVICE
   ================================ */
/*
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Temple App Backend running on port ${PORT}`);
});*/
// Physical Android Phone / iPhone
/*
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Temple App Backend running on port ${PORT}`);
});*/

//beore

/*app.listen(PORT, () => {
  console.log(`Temple App Backend running on port ${PORT}`);
});*/


//andriod
/*
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Temple App Backend running on port ${PORT}`);
});*/


app.listen(PORT, '0.0.0.0', () => {
  console.log(`Temple App Backend running on port ${PORT}`);
});