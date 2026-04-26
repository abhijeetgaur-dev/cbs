import { getPendingContents, getAllContents, approveContent, rejectContent } from '../services/approval.service.js';

export const getPending = async (req, res) => {
  try {
    const contents = await getPendingContents();
    return res.status(200).json({ contents });
  } catch (error) {
    console.error('Get pending error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getAll = async (req, res) => {
  try {
    const contents = await getAllContents();
    return res.status(200).json({ contents });
  } catch (error) {
    console.error('Get all error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const approve = async (req, res) => {
  try {
    const { contentId } = req.params;
    const content = await approveContent(contentId, req.user.id);
    return res.status(200).json({ message: 'Content approved', content });
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({ message: error.message });
    }
    console.error('Approve error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const reject = async (req, res) => {
  try {
    const { contentId } = req.params;
    const { rejection_reason } = req.body;
    const content = await rejectContent(contentId, req.user.id, rejection_reason);
    return res.status(200).json({ message: 'Content rejected', content });
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({ message: error.message });
    }
    console.error('Reject error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
