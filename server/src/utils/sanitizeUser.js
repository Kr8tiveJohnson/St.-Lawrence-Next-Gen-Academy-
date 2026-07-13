/**
 * Strips private fields from user object before sending it to the client.
 * Leaves private fields intact only if the requester is the user themselves or an admin.
 */
function sanitizeUser(user, requesterId = null, requesterRole = null) {
  if (!user) return null;
  
  const isAdmin = requesterRole === 'ADMIN' || requesterRole === 'MAIN_ADMIN';
  const isSelf = requesterId && requesterId === user.id;

  if (isAdmin || isSelf) {
    // Return all fields except password
    const { password, ...safeUser } = user;
    return safeUser;
  }

  // Strip private fields for public view
  const safeUser = {
    id: user.id,
    role: user.role,
    tier: user.tier,
    profile: user.profile ? {
      id: user.profile.id,
      fullName: user.profile.fullName, // Full name might be needed for public display, or maybe just first name? 
      avatarUrl: user.profile.avatarUrl
    } : null,
  };

  return safeUser;
}

module.exports = sanitizeUser;
