import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { pool } from '../db';
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
    const { name, description, image_url, significance, devotional, is_active = true } = req.body;
    if (!name?.trim()) return res.status(400).json({ success: false, message: 'Deity name is required' });
    const result = await pool.query(`
      INSERT INTO deities (name, description, image_url, significance, devotional, is_active)
      VALUES ($1,$2,$3,$4,$5,$6) RETURNING id, name, description, image_url, significance, devotional, is_active
    `, [name.trim(), description?.trim() || null, image_url?.trim() || null, significance?.trim() || null, devotional?.trim() || null, Boolean(is_active)]);
    res.status(201).json({ success: true, message: 'Deity created successfully', data: result.rows[0] });
  } catch (error) {
    console.error('Create deity error:', error);
    res.status(500).json({ success: false, message: 'Failed to create deity' });
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
        id,
        title,
        description,
        image_url,
        category,
        is_active
      FROM gallery
      ORDER BY id DESC
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
        is_active
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING
        id,
        title,
        description,
        image_url,
        category,
        is_active
      `,
      [
        title?.trim() || null,
        description?.trim() || null,
        finalImageUrl,
        category?.trim() || null,
        Boolean(is_active),
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
        is_active = COALESCE($5, is_active)
      WHERE id = $6
      RETURNING
        id,
        title,
        description,
        image_url,
        category,
        is_active
      `,
      [
        title?.trim() || null,
        description?.trim() || null,
        imageValue,
        category?.trim() || null,
        typeof is_active === 'boolean'
          ? is_active
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