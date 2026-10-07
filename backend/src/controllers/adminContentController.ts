import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { pool } from '../db';
import {
  createNotification,
  sendNotificationRecord,
} from '../services/notificationService';
const galleryUploadDir = path.join(
  process.cwd(),
  'uploads',
  'gallery'
);

if (!fs.existsSync(galleryUploadDir)) {
  fs.mkdirSync(galleryUploadDir, {
    recursive: true,
  });
}

export async function getAdminDeities(_req: Request, res: Response) {
  try {
    const result = await pool.query(`
      SELECT id, name, description, image_url, significance, devotional, is_active
      FROM deities ORDER BY id DESC
    `);
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Admin deities list error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch deities' });
  }
}

export async function createDeity(req: Request, res: Response) {
  try {
    const {
      name,
      description,
      image_url,
      significance,
      devotional,
      is_active = true,
    } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Deity name is required',
      });
    }

    // ------------------------------------
    // CREATE DEITY
    // ------------------------------------

    const result = await pool.query(
      `
      INSERT INTO deities (
        name,
        description,
        image_url,
        significance,
        devotional,
        is_active
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING
        id,
        name,
        description,
        image_url,
        significance,
        devotional,
        is_active
      `,
      [
        name.trim(),
        description?.trim() || null,
        image_url?.trim() || null,
        significance?.trim() || null,
        devotional?.trim() || null,
       String(is_active) !== 'false'
      ]
    );

    const createdDeity = result.rows[0];

    // ------------------------------------
    // SEND NOTIFICATION
    // ------------------------------------

    if (createdDeity.is_active) {
      try {
        const notification = await createNotification({
          title: '🙏 New Deity Added',
          body: `${createdDeity.name} has been added to the temple.`,

          notificationType: 'deity',

          data: {
            type: 'deity',
            deityId: createdDeity.id,
            screen: `/deity/${createdDeity.id}`,
          },

          targetType: 'all',
          scheduledAt: null,
        });

        await sendNotificationRecord(notification.id);

        console.log(
          `Deity notification processed for deity ${createdDeity.id}`
        );
      } catch (notificationError) {
        // Notification failure must NOT
        // cause deity creation to fail.
        console.error(
          'Deity notification error:',
          notificationError
        );
      }
    }

    // ------------------------------------
    // RESPONSE
    // ------------------------------------

    return res.status(201).json({
      success: true,
      message: 'Deity created successfully',
      data: createdDeity,
    });

  } catch (error) {
    console.error(
      'Create deity error:',
      error
    );

    return res.status(500).json({
      success: false,
      message: 'Failed to create deity',
    });
  }
}

export async function updateDeity(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { name, description, image_url, significance, devotional, is_active } = req.body;
    const result = await pool.query(`
      UPDATE deities SET
        name = COALESCE($1,name), description = COALESCE($2,description), image_url = COALESCE($3,image_url),
        significance = COALESCE($4,significance), devotional = COALESCE($5,devotional),
        is_active = COALESCE($6,is_active)
      WHERE id=$7
      RETURNING id, name, description, image_url, significance, devotional, is_active
    `, [name?.trim() || null, description?.trim() || null, image_url?.trim() || null, significance?.trim() || null, devotional?.trim() || null, typeof is_active === 'boolean' ? is_active : null, id]);
    if (!result.rows.length) return res.status(404).json({ success: false, message: 'Deity not found' });
    res.json({ success: true, message: 'Deity updated successfully', data: result.rows[0] });
  } catch (error) {
    console.error('Update deity error:', error);
    res.status(500).json({ success: false, message: 'Failed to update deity' });
  }
}

export async function deactivateDeity(req: Request, res: Response) {
  try {
    const result = await pool.query(`UPDATE deities SET is_active=FALSE WHERE id=$1 RETURNING id, name, is_active`, [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ success: false, message: 'Deity not found' });
    res.json({ success: true, message: 'Deity deactivated successfully', data: result.rows[0] });
  } catch (error) {
    console.error('Deactivate deity error:', error);
    res.status(500).json({ success: false, message: 'Failed to deactivate deity' });
  }
}
export async function getAdminGallery(
  _req: Request,
  res: Response
) {
  try {
    const result = await pool.query(`
      SELECT
        g.id,
        g.title,
        g.description,
        g.image_url,
        g.category,
        g.is_active,
        g.album_id,
        ga.name AS album_name
      FROM gallery g
      LEFT JOIN gallery_albums ga
        ON ga.id = g.album_id
      ORDER BY g.id DESC
    `);

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error('Admin gallery list error:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to fetch gallery',
    });
  }
}


export async function createGalleryItem(
  req: Request,
  res: Response
) {
  try {
    const {
  title,
  description,
  image_url,
  category,
  album_id,
  is_active = true,
} = req.body;

    /*
     * If an image was uploaded, use the uploaded
     * file path.
     *
     * Otherwise use the image URL entered by admin.
     */
    let finalImageUrl = image_url?.trim() || null;

    if (req.file) {
      finalImageUrl = `/uploads/gallery/${req.file.filename}`;
    }

    // Image is the only required field.
    if (!finalImageUrl) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an image URL or upload an image',
      });
    }

  const result = await pool.query(
  `
    INSERT INTO gallery (
      title,
      description,
      image_url,
      category,
      album_id,
      is_active
    )
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING
      id,
      title,
      description,
      image_url,
      category,
      album_id,
      is_active
  `,
  [
    title?.trim() || null,
    description?.trim() || null,
    finalImageUrl,
    category?.trim() || null,
    album_id ? Number(album_id) : null,
    String(is_active) !== 'false',
  ]
);

    res.status(201).json({
      success: true,
      message: 'Gallery item created successfully',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Create gallery item error:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to create gallery item',
    });
  }
}


export async function updateGalleryItem(
  req: Request,
  res: Response
) {
  try {
    const { id } = req.params;

  const {
  title,
  description,
  image_url,
  category,
  album_id,
  is_active,
} = req.body;

    /*
     * If admin uploads a new image,
     * replace the existing image URL.
     *
     * Otherwise, if admin provides an image URL,
     * use that.
     *
     * Otherwise keep the existing image.
     */
    let imageValue: string | null = null;

    if (req.file) {
      imageValue = `/uploads/gallery/${req.file.filename}`;
    } else if (image_url?.trim()) {
      imageValue = image_url.trim();
    }

  const result = await pool.query(
  `
    UPDATE gallery
    SET
      title = COALESCE($1, title),
      description = COALESCE($2, description),
      image_url = COALESCE($3, image_url),
      category = COALESCE($4, category),
      album_id = COALESCE($5, album_id),
      is_active = COALESCE($6, is_active)
    WHERE id = $7
    RETURNING
      id,
      title,
      description,
      image_url,
      category,
      album_id,
      is_active
  `,
  [
    title?.trim() || null,
    description?.trim() || null,
    imageValue,
    category?.trim() || null,

    album_id !== undefined &&
    album_id !== null &&
    album_id !== ''
      ? Number(album_id)
      : null,

    is_active !== undefined
      ? String(is_active) !== 'false'
      : null,

    id,
  ]
);
    if (!result.rows.length) {
      return res.status(404).json({
        success: false,
        message: 'Gallery item not found',
      });
    }

    res.json({
      success: true,
      message: 'Gallery item updated successfully',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Update gallery item error:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to update gallery item',
    });
  }
}


export async function deleteGalleryItem(
  req: Request,
  res: Response
) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Gallery item ID is required',
      });
    }

    const result = await pool.query(
      `
      DELETE FROM gallery
      WHERE id = $1
      RETURNING
        id,
        title,
        image_url
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Gallery item not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Gallery image deleted successfully',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Delete gallery item error:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to delete gallery image',
    });
  }
}
export async function uploadGalleryImage(
  req: Request,
  res: Response
) {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Image file is required',
      });
    }

    const imageUrl =
      `/uploads/gallery/${req.file.filename}`;

    res.status(201).json({
      success: true,
      message: 'Gallery image uploaded successfully',
      data: {
        image_url: imageUrl,
        filename: req.file.filename,
      },
    });
  } catch (error) {
    console.error(
      'Gallery image upload error:',
      error
    );

    res.status(500).json({
      success: false,
      message: 'Failed to upload gallery image',
    });
  }
}
// ========================================
// ANNOUNCEMENTS
// ========================================

export async function getAdminAnnouncements(
  _req: Request,
  res: Response
) {
  try {
    const result = await pool.query(`
      SELECT
        id,
        title,
        message,
        image_url,
        is_active,
        publish_at,
        created_at,
        updated_at
      FROM announcements
      ORDER BY
        COALESCE(publish_at, created_at) DESC,
        id DESC
    `);

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error(
      'Admin announcements list error:',
      error
    );

    res.status(500).json({
      success: false,
      message: 'Failed to fetch announcements',
    });
  }
}


// ========================================
// CREATE ANNOUNCEMENT
// ========================================

export async function createAnnouncement(
  req: Request,
  res: Response
) {
  try {
    const {
      title,
      message,
      image_url,
      is_active = true,
      publish_at,
      send_notification = false,
    } = req.body;

    // ------------------------------------
    // VALIDATION
    // ------------------------------------

    if (!title?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Announcement title is required',
      });
    }

    if (!message?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Announcement message is required',
      });
    }


    // ------------------------------------
    // VALIDATE SCHEDULE DATE
    // ------------------------------------

    let publishAtValue: Date | null = null;

    if (publish_at) {
      const parsedDate =
        new Date(publish_at);

      if (
        Number.isNaN(
          parsedDate.getTime()
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            'Invalid publish date/time',
        });
      }

      if (
        parsedDate.getTime() <=
        Date.now()
      ) {
        return res.status(400).json({
          success: false,
          message:
            'Scheduled time must be in the future',
        });
      }

      publishAtValue =
        parsedDate;
    }


    // ------------------------------------
    // CREATE ANNOUNCEMENT
    // ------------------------------------

    const result = await pool.query(
      `
      INSERT INTO announcements (
        title,
        message,
        image_url,
        is_active,
        publish_at
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING
        id,
        title,
        message,
        image_url,
        is_active,
        publish_at,
        created_at,
        updated_at
      `,
      [
        title.trim(),
        message.trim(),
        image_url?.trim() || null,
        Boolean(is_active),
        publishAtValue,
      ]
    );


    const announcement =
      result.rows[0];


    // ------------------------------------
    // SEND NOW
    // ------------------------------------

    if (
      Boolean(send_notification) &&
      !publishAtValue
    ) {

      const notification =
        await createNotification({
          title:
            announcement.title,

          body:
            announcement.message,

          notificationType:
            'announcement',

          data: {
            type: 'announcement',
            screen: 'announcements',
            announcementId:
              announcement.id,
          },

          targetType: 'all',

          scheduledAt: null,
        });


      const sendResult =
        await sendNotificationRecord(
          notification.id
        );


      return res.status(201).json({
        success: true,
        message:
          'Announcement created and notification sent',
        data: {
          announcement,
          notification:
            sendResult,
        },
      });
    }


    // ------------------------------------
    // SCHEDULE NOTIFICATION
    // ------------------------------------

    if (publishAtValue) {

      await createNotification({
        title:
          announcement.title,

        body:
          announcement.message,

        notificationType:
          'announcement',

        data: {
          type: 'announcement',
          screen: 'announcements',
          announcementId:
            announcement.id,
        },

        targetType: 'all',

        scheduledAt:
          publishAtValue,
      });


      return res.status(201).json({
        success: true,
        message:
          'Announcement scheduled successfully',
        data: announcement,
      });
    }


    // ------------------------------------
    // CREATE WITHOUT NOTIFICATION
    // ------------------------------------

    return res.status(201).json({
      success: true,
      message:
        'Announcement created successfully',
      data: announcement,
    });

  } catch (error) {

    console.error(
      'Create announcement error:',
      error
    );

    res.status(500).json({
      success: false,
      message:
        'Failed to create announcement',
    });
  }
}

// ========================================
// UPDATE ANNOUNCEMENT
// ========================================

export async function updateAnnouncement(
  req: Request,
  res: Response
) {
  try {
    const { id } = req.params;

    const {
      title,
      message,
      image_url,
      is_active,
      publish_at,
    } = req.body;

    // ------------------------------------
    // CHECK ANNOUNCEMENT
    // ------------------------------------

    const existingResult = await pool.query(
      `
      SELECT
        id,
        title,
        message,
        image_url,
        is_active,
        publish_at
      FROM announcements
      WHERE id = $1
      `,
      [id]
    );

    if (!existingResult.rows.length) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found',
      });
    }

    const existing =
      existingResult.rows[0];

    // ------------------------------------
    // VALIDATE SCHEDULE
    // ------------------------------------

    let publishAtValue:
      | Date
      | null
      | undefined = undefined;

    if (publish_at !== undefined) {
      if (
        publish_at === null ||
        publish_at === ''
      ) {
        publishAtValue = null;
      } else {
        const parsedDate =
          new Date(publish_at);

        if (
          Number.isNaN(
            parsedDate.getTime()
          )
        ) {
          return res.status(400).json({
            success: false,
            message:
              'Invalid publish date/time',
          });
        }

        if (
          parsedDate.getTime() <=
          Date.now()
        ) {
          return res.status(400).json({
            success: false,
            message:
              'Scheduled time must be in the future',
          });
        }

        publishAtValue =
          parsedDate;
      }
    }

    // ------------------------------------
    // UPDATE ANNOUNCEMENT
    // ------------------------------------

    const result = await pool.query(
      `
      UPDATE announcements
      SET
        title = COALESCE($1, title),
        message = COALESCE($2, message),
        image_url = COALESCE($3, image_url),
        is_active = COALESCE($4, is_active),
        publish_at =
          CASE
            WHEN $5::boolean = TRUE
              THEN $6
            ELSE publish_at
          END,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $7
      RETURNING
        id,
        title,
        message,
        image_url,
        is_active,
        publish_at,
        created_at,
        updated_at
      `,
      [
        title?.trim() || null,
        message?.trim() || null,
        image_url?.trim() || null,
        typeof is_active === 'boolean'
          ? is_active
          : null,
        publish_at !== undefined,
        publishAtValue ?? null,
        id,
      ]
    );

    const announcement =
      result.rows[0];

    // ------------------------------------
    // FIND SCHEDULED NOTIFICATION
    // ------------------------------------

    const scheduledNotification =
      await pool.query(
        `
        SELECT id
        FROM notifications
        WHERE notification_type = 'announcement'
          AND data->>'announcementId' = $1
          AND status = 'scheduled'
        ORDER BY id DESC
        LIMIT 1
        `,
        [String(id)]
      );

    // ------------------------------------
    // UPDATE EXISTING SCHEDULED PUSH
    // ------------------------------------

    if (
      scheduledNotification.rows.length
    ) {
      const notificationId =
        scheduledNotification.rows[0].id;

      // If announcement became inactive,
      // cancel the scheduled notification.
      if (!announcement.is_active) {
        await pool.query(
          `
          UPDATE notifications
          SET
            status = 'cancelled',
            updated_at = CURRENT_TIMESTAMP
          WHERE id = $1
            AND status = 'scheduled'
          `,
          [notificationId]
        );
      }

      // If scheduling was removed,
      // cancel the scheduled notification.
      else if (
        announcement.publish_at === null
      ) {
        await pool.query(
          `
          UPDATE notifications
          SET
            status = 'cancelled',
            updated_at = CURRENT_TIMESTAMP
          WHERE id = $1
            AND status = 'scheduled'
          `,
          [notificationId]
        );
      }

      // Otherwise update title/body/time.
      else {
        await pool.query(
          `
          UPDATE notifications
          SET
            title = $1,
            body = $2,
            data = $3::jsonb,
            scheduled_at = $4,
            status = 'scheduled',
            updated_at = CURRENT_TIMESTAMP
          WHERE id = $5
            AND status = 'scheduled'
          `,
          [
            announcement.title,
            announcement.message,
            JSON.stringify({
              type: 'announcement',
              screen: 'announcements',
              announcementId:
                announcement.id,
            }),
            announcement.publish_at,
            notificationId,
          ]
        );
      }
    }

    return res.json({
      success: true,
      message:
        'Announcement updated successfully',
      data: announcement,
    });

  } catch (error) {
    console.error(
      'Update announcement error:',
      error
    );

    return res.status(500).json({
      success: false,
      message:
        'Failed to update announcement',
    });
  }
}

// ========================================
// DELETE ANNOUNCEMENT
// ========================================

export async function deleteAnnouncement(
  req: Request,
  res: Response
) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message:
          'Announcement ID is required',
      });
    }

    // ------------------------------------
    // CHECK ANNOUNCEMENT
    // ------------------------------------

    const existing =
      await pool.query(
        `
        SELECT
          id,
          title
        FROM announcements
        WHERE id = $1
        `,
        [id]
      );

    if (!existing.rows.length) {
      return res.status(404).json({
        success: false,
        message:
          'Announcement not found',
      });
    }

    // ------------------------------------
    // CANCEL SCHEDULED NOTIFICATIONS
    // ------------------------------------

    await pool.query(
      `
      UPDATE notifications
      SET
        status = 'cancelled',
        updated_at = CURRENT_TIMESTAMP
      WHERE notification_type = 'announcement'
        AND data->>'announcementId' = $1
        AND status = 'scheduled'
      `,
      [String(id)]
    );

    // ------------------------------------
    // DELETE ANNOUNCEMENT
    // ------------------------------------

    const result =
      await pool.query(
        `
        DELETE FROM announcements
        WHERE id = $1
        RETURNING
          id,
          title
        `,
        [id]
      );

    return res.status(200).json({
      success: true,
      message:
        'Announcement deleted successfully',
      data: result.rows[0],
    });

  } catch (error) {
    console.error(
      'Delete announcement error:',
      error
    );

    return res.status(500).json({
      success: false,
      message:
        'Failed to delete announcement',
    });
  }
}
import {
  sendNotificationToAllUsers,
} from '../services/notificationService';
// ========================================
// SEND ANNOUNCEMENT NOTIFICATION
// ========================================

export async function sendAnnouncementNotification(
  req: Request,
  res: Response
) {
  try {
    const { id } = req.params;

    // ------------------------------------
    // GET ANNOUNCEMENT
    // ------------------------------------

    const result = await pool.query(
      `
      SELECT
        id,
        title,
        message,
        image_url,
        is_active,
        publish_at
      FROM announcements
      WHERE id = $1
      `,
      [id]
    );

    if (!result.rows.length) {
      return res.status(404).json({
        success: false,
        message:
          'Announcement not found',
      });
    }

    const announcement =
      result.rows[0];

    // ------------------------------------
    // CHECK ACTIVE
    // ------------------------------------

    if (!announcement.is_active) {
      return res.status(400).json({
        success: false,
        message:
          'Cannot send an inactive announcement',
      });
    }

    // ------------------------------------
    // CHECK ALREADY SENT
    // ------------------------------------

    const sentNotification =
      await pool.query(
        `
        SELECT id
        FROM notifications
        WHERE notification_type = 'announcement'
          AND data->>'announcementId' = $1
          AND status = 'sent'
        LIMIT 1
        `,
        [String(announcement.id)]
      );

    if (sentNotification.rows.length) {
      return res.status(400).json({
        success: false,
        message:
          'Notification for this announcement has already been sent',
      });
    }

    // ------------------------------------
    // FIND EXISTING SCHEDULED NOTIFICATION
    // ------------------------------------

    const scheduledNotification =
      await pool.query(
        `
        SELECT id
        FROM notifications
        WHERE notification_type = 'announcement'
          AND data->>'announcementId' = $1
          AND status = 'scheduled'
        ORDER BY id DESC
        LIMIT 1
        `,
        [String(announcement.id)]
      );

    let notificationId: number;

    // ------------------------------------
    // USE EXISTING SCHEDULED NOTIFICATION
    // ------------------------------------

    if (
      scheduledNotification.rows.length
    ) {
      notificationId =
        scheduledNotification.rows[0].id;

      await pool.query(
        `
        UPDATE notifications
        SET
          title = $1,
          body = $2,
          data = $3::jsonb,
          scheduled_at = NULL,
          status = 'pending',
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $4
        `,
        [
          announcement.title,
          announcement.message,
          JSON.stringify({
            type: 'announcement',
            screen: 'announcements',
            announcementId:
              announcement.id,
          }),
          notificationId,
        ]
      );
    }

    // ------------------------------------
    // CREATE NEW IMMEDIATE NOTIFICATION
    // ------------------------------------

    else {
      const notification =
        await createNotification({
          title:
            announcement.title,
          body:
            announcement.message,
          notificationType:
            'announcement',
          data: {
            type: 'announcement',
            screen: 'announcements',
            announcementId:
              announcement.id,
          },
          targetType: 'all',
          scheduledAt: null,
        });

      notificationId =
        notification.id;
    }

    // ------------------------------------
    // SEND
    // ------------------------------------

    const sendResult =
      await sendNotificationRecord(
        notificationId
      );

    return res.status(200).json({
      success:
        sendResult.success,

      message:
        sendResult.success
          ? 'Announcement notification sent successfully'
          : 'Announcement notification failed',

      data: sendResult,
    });

  } catch (error) {
    console.error(
      'Send announcement notification error:',
      error
    );

    return res.status(500).json({
      success: false,
      message:
        'Failed to send announcement notification',
    });
  }
}