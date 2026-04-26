import { uploadContent, getMyContent } from '../services/content.service.js';

export const upload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const fileData = {
      location: req.file.location,
      mimetype: req.file.mimetype,
      size: req.file.size
    };

    const newContent = await uploadContent(req.body, fileData, req.user.id);
    return res.status(201).json({ message: 'Content uploaded successfully', content: newContent });
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const myContent = async (req, res) => {
  try {
    const contents = await getMyContent(req.user.id);
    return res.status(200).json({ contents });
  } catch (error) {
    console.error('Fetch my content error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
