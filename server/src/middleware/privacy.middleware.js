// privacy.middleware — Response sanitiser
// CRITICAL: Strips real name and full personal details from ALL non-admin API responses.
// Enforcement is at the middleware layer — NOT just hidden in the UI.
// Fields always removed for non-admin callers:
//   realName, firstName, lastName, phoneNumber, email, homeAddress, schoolName,
//   dateOfBirth, parentName, parentPhone, nationalId, and any field tagged as 'private'
// Fields always visible: country, state (public by design per brief §4)
// Profile photo URL: only returned if photo.status === 'approved' AND visibility rules pass
