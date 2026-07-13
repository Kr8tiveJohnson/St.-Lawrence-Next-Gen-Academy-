const prisma = require('../config/database');
const sanitizeUser = require('../utils/sanitizeUser');

/**
 * Get user's friends list (with geo-gating)
 */
async function getFriends(req, res) {
  try {
    const userId = req.user.id;

    // Get accepted friendships
    const friendships = await prisma.friendship.findMany({
      where: {
        AND: [
          {
            OR: [
              { requesterId: userId },
              { receiverId: userId }
            ]
          },
          { status: 'ACCEPTED' }
        ]
      },
      include: {
        requester: { include: { profile: true } },
        receiver: { include: { profile: true } }
      }
    });

    // Extract friend objects (the user that is not the current user)
    const friends = friendships.map(friendship => {
      const friend = friendship.requesterId === userId ? friendship.receiver : friendship.requester;
      return sanitizeUser(friend, userId, req.user.role);
    });

    res.status(200).json({ friends });
  } catch (error) {
    console.error('Get friends error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Send friend request
 */
async function sendFriendRequest(req, res) {
  try {
    const { receiverId } = req.body;
    const requesterId = req.user.id;

    if (!receiverId) {
      return res.status(400).json({ error: 'Receiver ID is required' });
    }

    if (receiverId === requesterId) {
      return res.status(400).json({ error: 'Cannot send friend request to yourself' });
    }

    // Check if receiver exists
    const receiver = await prisma.user.findUnique({ where: { id: receiverId } });
    if (!receiver) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if friendship already exists
    const existing = await prisma.friendship.findFirst({
      where: {
        OR: [
          { requesterId, receiverId },
          { requesterId: receiverId, receiverId: requesterId }
        ]
      }
    });

    if (existing) {
      if (existing.status === 'PENDING') {
        return res.status(400).json({ error: 'Friend request already sent' });
      } else if (existing.status === 'ACCEPTED') {
        return res.status(400).json({ error: 'Already friends' });
      }
    }

    const friendship = await prisma.friendship.create({
      data: {
        requesterId,
        receiverId,
        status: 'PENDING'
      },
      include: {
        requester: { include: { profile: true } },
        receiver: { include: { profile: true } }
      }
    });

    res.status(201).json({ friendship });
  } catch (error) {
    console.error('Send friend request error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Accept friend request
 */
async function acceptFriendRequest(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const friendship = await prisma.friendship.updateMany({
      where: {
        AND: [
          { id },
          { receiverId: userId },
          { status: 'PENDING' }
        ]
      },
      data: { status: 'ACCEPTED' }
    });

    if (friendship.count === 0) {
      return res.status(404).json({ error: 'Friend request not found or already processed' });
    }

    const updated = await prisma.friendship.findUnique({
      where: { id },
      include: {
        requester: { include: { profile: true } },
        receiver: { include: { profile: true } }
      }
    });

    res.status(200).json({ friendship: updated });
  } catch (error) {
    console.error('Accept friend request error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Reject or unfriend
 */
async function rejectFriendRequest(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const friendship = await prisma.friendship.updateMany({
      where: {
        AND: [
          { id },
          {
            OR: [
              { receiverId: userId },
              { requesterId: userId }
            ]
          }
        ]
      },
      data: { status: 'REJECTED' }
    });

    if (friendship.count === 0) {
      return res.status(404).json({ error: 'Friendship not found' });
    }

    res.status(200).json({ message: 'Friend request rejected or unfriended' });
  } catch (error) {
    console.error('Reject friend request error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Get pending friend requests
 */
async function getPendingRequests(req, res) {
  try {
    const userId = req.user.id;

    const requests = await prisma.friendship.findMany({
      where: {
        AND: [
          { receiverId: userId },
          { status: 'PENDING' }
        ]
      },
      include: {
        requester: { include: { profile: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json({ requests });
  } catch (error) {
    console.error('Get pending requests error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  getFriends,
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  getPendingRequests
};
