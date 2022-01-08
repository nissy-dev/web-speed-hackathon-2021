import React from 'react';

/**
 * @typedef {object} Props
 * @property {string} soundSvgSrc
 */

/**
 * @type {React.VFC<Props>}
 */
const SoundWaveSVG = ({ soundSvgSrc }) => {
  return <img className="w-full h-full" src={soundSvgSrc} />;
};

export { SoundWaveSVG };
