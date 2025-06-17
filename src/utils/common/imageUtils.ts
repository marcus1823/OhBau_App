/**
 * Utility for handling images throughout the application
 */

/**
 * Get the appropriate source for an avatar image
 * @param avatarUrl Optional URL string for avatar
 * @returns Image source object for React Native Image component
 */
export const getAvatarSource = (avatarUrl?: string) => {
  if (avatarUrl) {
    return { uri: avatarUrl };
  }
  return require('../../assets/images/skelector/doctorSkelector.jpg');
};

/**
 * Get the initials from a name for avatar fallback
 * @param name Full name
 * @returns First letter of the name or default
 */
export const getInitials = (name?: string): string => {
  if (!name) {return '?';}
  return name.charAt(0).toUpperCase();
};
