import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import bcrypt from 'bcryptjs';
import { pool } from '../db';
import jwt from 'jsonwebtoken';

// =========================
// REGISTER
// =========================

export const register = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      full_name,
      email,
      phone,
      password,
    } = req.body;

    if (!full_name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Full name, email and password are required',
      });
    }

    const existingUser = await pool.query(
      `SELECT id
       FROM users
       WHERE email = $1`,
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Email already registered',
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (
        full_name,
        email,
        phone,
        password_hash
      )
      VALUES ($1, $2, $3, $4)
      RETURNING
        id,
        full_name,
        email,
        phone,
        created_at`,
      [
        full_name,
        email,
        phone || null,
        passwordHash,
      ]
    );

    return res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: result.rows[0],
    });
  } catch (error: any) {
    console.error('Registration error:', error);

    if (error.code === '23505') {
      return res.status(409).json({
        success: false,
        message: 'Email or phone already registered',
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Registration failed',
    });
  }
};

// =========================
// LOGIN
// =========================

export const login = async (
  req: Request,
  res: Response
) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    const result = await pool.query(
      `SELECT
         id,
         full_name,
         email,
         phone,
         password_hash,
         role
       FROM users
       WHERE email = $1`,
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const user = result.rows[0];

    if (!user.password_hash) {
      return res.status(401).json({
        success: false,
        message: 'Password login is not available for this account',
      });
    }

    const passwordMatches = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: '7d',
      }
    );

    return res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user.id,
          full_name: user.full_name,
          email: user.email,
          phone: user.phone,
          role: user.role,
        },
      },
    });
  } catch (error) {
    console.error('Login error:', error);

    return res.status(500).json({
      success: false,
      message: 'Login failed',
    });
  }
};

// =========================
// GET CURRENT USER
// =========================

export const getMe = async (
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

    const result = await pool.query(
      `SELECT
         id,
         full_name,
         email,
         phone,
         role,
         created_at
       FROM users
       WHERE id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    return res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Get current user error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch user',
    });
  }
};
// =========================
// FORGOT PASSWORD
// =========================

export const forgotPassword = async (
  req: Request,
  res: Response
) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: 'Mobile number is required',
      });
    }

    // Find user by mobile number
    const userResult = await pool.query(
      `SELECT id, full_name, phone
       FROM users
       WHERE phone = $1`,
      [phone]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No account found with this mobile number',
      });
    }

    const user = userResult.rows[0];

    // Generate 6-digit OTP
    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    // Hash OTP before storing
    const otpHash = await bcrypt.hash(otp, 10);

    // OTP valid for 5 minutes
    const expiresAt = new Date(
      Date.now() + 5 * 60 * 1000
    );

    // Remove previous password reset OTPs for this user
    await pool.query(
      `DELETE FROM password_reset_otps
       WHERE user_id = $1`,
      [user.id]
    );

    // Store new OTP
    await pool.query(
      `INSERT INTO password_reset_otps (
        user_id,
        otp_hash,
        expires_at
      )
      VALUES ($1, $2, $3)`,
      [
        user.id,
        otpHash,
        expiresAt,
      ]
    );

    // DEVELOPMENT ONLY
    // Later this will be replaced with real SMS delivery.
    console.log(
      `[DEV OTP] Password reset OTP for ${phone}: ${otp}`
    );

    return res.json({
      success: true,
      message: 'OTP generated successfully',
    });
  } catch (error) {
    console.error(
      'Forgot password error:',
      error
    );

    return res.status(500).json({
      success: false,
      message: 'Failed to generate OTP',
    });
  }
};