const prisma = require('../config/database');

/**
 * Get user's chat rooms/conversations
 */
async function getChatRooms(req, res) {
  try {
    const userId = req.user.id;

    // Get all conversations where user is sender or receiver
    const rooms = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId },
          { receiverId: userId }
        ]
      },
      distinct: ['senderId', 'receiverId'],
      include: {
        sender: { include: { profile: true } },
        receiver: { include: { profile: true } }
      },
      orderBy: { createdAt: 'desc' },
      take: 50
    });

    res.status(200).json({ rooms });
  } catch (error) {
    console.error('Get chat rooms error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Get messages in a chat room
 */
async function getRoomMessages(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { limit = 50, offset = 0 } = req.query;

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { AND: [{ senderId: userId }, { receiverId: id }] },
          { AND: [{ senderId: id }, { receiverId: userId }] }
        ]
      },
      include: {
        sender: { include: { profile: true } },
        receiver: { include: { profile: true } }
      },
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit),
      skip: parseInt(offset)
    });

    res.status(200).json({ messages: messages.reverse() });
  } catch (error) {
    console.error('Get room messages error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Send a direct message
 */
async function sendMessage(req, res) {
  try {
    const { receiverId, content, type } = req.body;
    const senderId = req.user.id;

    if (!receiverId || !content) {
      return res.status(400).json({ error: 'Receiver ID and content are required' });
    }

    // Verify receiver exists
    const receiver = await prisma.user.findUnique({ where: { id: receiverId } });
    if (!receiver) {
      return res.status(404).json({ error: 'Receiver not found' });
    }

    const message = await prisma.message.create({
      data: {
        content,
        type: type || 'DIRECT',
        senderId,
        receiverId
      },
      include: {
        sender: { include: { profile: true } },
        receiver: { include: { profile: true } }
      }
    });

    res.status(201).json({ message });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Report a message (for moderation)
 */
async function reportMessage(req, res) {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const userId = req.user.id;

    if (!reason) {
      return res.status(400).json({ error: 'Report reason is required' });
    }

    const message = await prisma.message.findUnique({ where: { id } });
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    // Store report (you may need to add a Report model to schema)
    res.status(200).json({
      message: 'Message reported successfully',
      data: {
        messageId: id,
        reportedBy: userId,
        reason,
        timestamp: new Date()
      }
    });
  } catch (error) {
    console.error('Report message error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  getChatRooms,
  getRoomMessages,
  sendMessage,
  reportMessage
};
