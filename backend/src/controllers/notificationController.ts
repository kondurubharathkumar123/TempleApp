import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { pool } from '../db';
import {
  sendPushNotificationToUser,
} from '../services/notificationService';

// ========================================
// REGISTER DEVICE FOR PUSH NOTIFICATIONS
// ========================================

export const registerDevice = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    const {
      expoPushToken,
      platform,
      deviceName,
    } = req.body;

    if (!expoPushToken) {
      return res.status(400).json({
        success: false,
        message: 'Expo push token is required',
      });
    }

    if (!platform) {
      return res.status(400).json({
        success: false,
        message: 'Platform is required',
      });
    }

    const result = await pool.query(
      `INSERT INTO device_tokens (
        user_id,
        expo_push_token,
        platform,
        device_name,
        is_active,
        updated_at
      )
      VALUES ($1, $2, $3, $4, TRUE, CURRENT_TIMESTAMP)

      ON CONFLICT (expo_push_token)
      DO UPDATE SET
        user_id = EXCLUDED.user_id,
        platform = EXCLUDED.platform,
        device_name = EXCLUDED.device_name,
        is_active = TRUE,
        updated_at = CURRENT_TIMESTAMP

      RETURNING
        id,
        user_id,
        expo_push_token,
        platform,
        device_name,
        is_active,
        created_at,
        updated_at`,
      [
        userId,
        expoPushToken,
        platform,
        deviceName || null,
      ]
    );

    return res.status(200).json({
      success: true,
      message: 'Device registered for notifications',
      data: result.rows[0],
    });
  } catch (error) {
    console.error(
      'Register device error:',
      error
    );

    return res.status(500).json({
      success: false,
      message: 'Failed to register device',
    });
  }
};

// ========================================
// SEND TEST PUSH NOTIFICATION
// ========================================

export const sendTestNotification = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    await sendPushNotificationToUser(
      userId,
      'Temple App',
      'This is a test push notification 🙏',
      {
        type: 'test',
        screen: 'home',
      }
    );

    return res.status(200).json({
      success: true,
      message: 'Test notification sent',
    });
  } catch (error) {
    console.error(
      'Test notification error:',
      error
    );

    return res.status(500).json({
      success: false,
      message: 'Failed to send test notification',
    });
  }
};