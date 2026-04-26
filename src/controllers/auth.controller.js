import { registerUser, loginUser } from '../services/auth.service.js';

export const register = async (req, res) => {
  try {
    const newUser = await registerUser(req.body);
    return res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    if (error.status === 409) {
      return res.status(409).json({ message: error.message });
    }
    console.error('Registration error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const login = async (req, res) => {
  try {
    const { token, user } = await loginUser(req.body);
    return res.status(200).json({ message: 'Login successful', token, role: user.role });
  } catch (error) {
    if (error.status === 401) {
      return res.status(401).json({ message: error.message });
    }
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
