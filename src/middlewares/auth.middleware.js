import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log("AUTH HEADER:", req.headers.authorization);
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Missing or invalid token' });
  }
  
  const token = authHeader.split(' ')[1];
  console.log("TOKEN:", token);
  try {
    const secret = process.env.JWT_SECRET?.trim();
    if (!secret) {
        console.error('JWT_SECRET is not defined in environment variables');
        return res.status(500).json({ message: 'Internal server configuration error' });
    }

    const decoded = jwt.verify(token, secret);
    req.user = decoded; 
    next();
  } catch (err) {
    console.error('JWT Verification Error:', err.message);
    return res.status(401).json({ message: 'Invalid token', error: err.message });
  }
};
