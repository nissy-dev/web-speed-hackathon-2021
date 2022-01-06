/**
 * @param {string} imageId
 * @returns {string}
 */
function getImagePath(imageId, isSmall) {
  return `/images/${imageId}${isSmall ? '-small' : ''}.webp`;
}

/**
 * @param {string} movieId
 * @returns {string}
 */
function getMoviePath(movieId) {
  return `/movies/${movieId}.mp4`;
}

/**
 * @param {string} soundId
 * @returns {string}
 */
function getSoundPath(soundId) {
  return `/sounds/${soundId}.ogg`;
}

/**
 * @param {string} profileImageId
 * @returns {string}
 */
function getProfileImagePath(profileImageId) {
  return `/images/profiles/${profileImageId}.webp`;
}

export { getImagePath, getMoviePath, getSoundPath, getProfileImagePath };
