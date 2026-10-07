import { Request, Response } from 'express';
import { pool } from '../db';

/*
 * GET ALL GALLERY ALBUMS
 */
export const getGalleryAlbums = async (
  _req: Request,
  res: Response
) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        name,
        description,
        display_order,
        is_active,
        created_at
      FROM gallery_albums
      ORDER BY display_order ASC, id DESC
    `);

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error('Error fetching gallery albums:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to fetch gallery albums',
    });
  }
};

/*
 * CREATE GALLERY ALBUM / HEADING
 */
export const createGalleryAlbum = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      name,
      description,
      display_order,
      is_active,
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Album name is required',
      });
    }

    const result = await pool.query(
      `
      INSERT INTO gallery_albums (
        name,
        description,
        display_order,
        is_active
      )
      VALUES ($1, $2, $3, $4)
      RETURNING *
      `,
      [
        name.trim(),
        description?.trim() || null,
        Number(display_order) || 0,
        is_active !== false,
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Gallery album created successfully',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error creating gallery album:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to create gallery album',
    });
  }
};

/*
 * UPDATE GALLERY ALBUM
 */
export const updateGalleryAlbum = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const {
      name,
      description,
      display_order,
      is_active,
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Album name is required',
      });
    }

    const result = await pool.query(
      `
      UPDATE gallery_albums
      SET
        name = $1,
        description = $2,
        display_order = $3,
        is_active = $4
      WHERE id = $5
      RETURNING *
      `,
      [
        name.trim(),
        description?.trim() || null,
        Number(display_order) || 0,
        is_active !== false,
        id,
      ]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Gallery album not found',
      });
    }

    res.json({
      success: true,
      message: 'Gallery album updated successfully',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error updating gallery album:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to update gallery album',
    });
  }
};

/*
 * DELETE GALLERY ALBUM
 *
 * Because gallery.album_id uses ON DELETE SET NULL,
 * deleting an album will NOT delete its photos.
 */
export const deleteGalleryAlbum = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      DELETE FROM gallery_albums
      WHERE id = $1
      RETURNING id
      `,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Gallery album not found',
      });
    }

    res.json({
      success: true,
      message: 'Gallery album deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting gallery album:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to delete gallery album',
    });
  }
};