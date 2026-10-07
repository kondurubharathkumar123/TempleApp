import { Request, Response } from 'express';
import { pool } from '../db';

/*
 * =========================================
 * EXISTING FLAT GALLERY
 * =========================================
 *
 * Keep this endpoint for backward
 * compatibility with the current app.
 */

export const getGallery = async (
  _req: Request,
  res: Response
) => {
  try {
    const result = await pool.query(
      `
        SELECT
          id,
          title,
          description,
          image_url,
          category,
          album_id,
          is_active
        FROM gallery
        WHERE is_active = TRUE
        ORDER BY id DESC
      `
    );

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error(
      'Error fetching gallery:',
      error
    );

    res.status(500).json({
      success: false,
      message: 'Failed to fetch gallery',
    });
  }
};

/*
 * =========================================
 * GALLERY GROUPED BY HEADINGS / ALBUMS
 * =========================================
 *
 * Response:
 *
 * Anjaneya Swamy
 *   -> Photo 1
 *   -> Photo 2
 *   -> Photo 3
 *
 * Temple Outside
 *   -> Photo 4
 *   -> Photo 5
 */

export const getGalleryAlbums = async (
  _req: Request,
  res: Response
) => {
  try {
    const result = await pool.query(
      `
        SELECT
          ga.id,
          ga.name,
          ga.description,
          ga.display_order,

          COALESCE(
            json_agg(
              json_build_object(
                'id', g.id,
                'title', g.title,
                'description', g.description,
                'image_url', g.image_url,
                'category', g.category,
                'album_id', g.album_id,
                'is_active', g.is_active
              )
              ORDER BY g.id DESC
            )
            FILTER (
              WHERE g.id IS NOT NULL
            ),
            '[]'::json
          ) AS images

        FROM gallery_albums ga

        LEFT JOIN gallery g
          ON g.album_id = ga.id
          AND g.is_active = TRUE

        WHERE ga.is_active = TRUE

        GROUP BY
          ga.id,
          ga.name,
          ga.description,
          ga.display_order

        ORDER BY
          ga.display_order ASC,
          ga.id ASC
      `
    );

    return res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error(
      'Error fetching gallery albums:',
      error
    );

    return res.status(500).json({
      success: false,
      message:
        'Failed to fetch gallery albums',
    });
  }
};