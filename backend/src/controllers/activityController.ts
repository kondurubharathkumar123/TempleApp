import { Request, Response } from 'express';
import { pool } from '../db';

export const getActivities = async (
  _req: Request,
  res: Response
) => {
  try {
    const result = await pool.query(
      `SELECT
         a.id,
         a.title,
         a.description,
         a.image_url,
         a.activity_date,
         a.location,
         a.section_id,
         a.display_order,
         a.is_active,
         s.name AS section_name
       FROM activities a
       INNER JOIN activity_sections s
         ON a.section_id = s.id
       WHERE a.is_active = TRUE
         AND s.is_active = TRUE
       ORDER BY
         s.display_order ASC,
         a.display_order ASC,
         a.activity_date ASC NULLS LAST,
         a.id ASC`
    );

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error('Error fetching activities:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to fetch activities',
    });
  }
};

export const getActivitiesBySection = async (
  req: Request,
  res: Response
) => {
  try {
    const { sectionId } = req.params;

    // Check section
    const sectionResult = await pool.query(
      `SELECT
         id,
         name,
         description,
         icon,
         image_url,
         display_order,
         is_active
       FROM activity_sections
       WHERE id = $1
         AND is_active = TRUE`,
      [sectionId]
    );

    if (sectionResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Activity section not found',
      });
    }

    const activitiesResult = await pool.query(
      `SELECT
         id,
         title,
         description,
         image_url,
         activity_date,
         location,
         section_id,
         display_order,
         is_active
       FROM activities
       WHERE section_id = $1
         AND is_active = TRUE
       ORDER BY
         display_order ASC,
         activity_date ASC NULLS LAST,
         id ASC`,
      [sectionId]
    );

    res.json({
      success: true,
      data: {
        section: sectionResult.rows[0],
        activities: activitiesResult.rows,
      },
    });
  } catch (error) {
    console.error(
      'Error fetching activities by section:',
      error
    );

    res.status(500).json({
      success: false,
      message: 'Failed to fetch section activities',
    });
  }
};

export const getActivityById = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT
         a.id,
         a.title,
         a.description,
         a.image_url,
         a.activity_date,
         a.location,
         a.section_id,
         a.display_order,
         a.is_active,
         s.name AS section_name,
         s.description AS section_description,
         s.icon AS section_icon,
         s.image_url AS section_image_url
       FROM activities a
       INNER JOIN activity_sections s
         ON a.section_id = s.id
       WHERE a.id = $1
         AND a.is_active = TRUE
         AND s.is_active = TRUE`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Activity not found',
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error(
      'Error fetching activity:',
      error
    );

    res.status(500).json({
      success: false,
      message: 'Failed to fetch activity',
    });
  }
};