import classNames from 'classnames';
import React, { useEffect } from 'react';

import { AspectRatioBox } from '../AspectRatioBox';
import { faPause, faPlay, FontAwesomeIcon } from '../FontAwesomeIcon';

/**
 * @typedef {object} Props
 * @property {string} src
 */

/**
 * クリックすると再生・一時停止を切り替えます。
 * @type {React.VFC<Props>}
 */
const PausableMovie = ({ src }) => {
  /** @type {React.RefObject<HTMLVideoElement */
  const animatorRef = React.useRef(null);
  /** @type {React.RefCallback<HTMLCanvasElement>} */
  const canvasCallbackRef = React.useCallback(async (el) => {
    animatorRef.current?.pause();
    if (el === null) {
      return;
    }
    animatorRef.current = el;
    // 視覚効果 off のとき GIF を自動再生しない
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsPlaying(false);
      animatorRef.current?.pause();
    } else {
      setIsPlaying(true);
      animatorRef.current?.play();
    }
  }, []);
  const [isPlaying, setIsPlaying] = React.useState(true);
  const handleClick = React.useCallback(() => {
    setIsPlaying((isPlaying) => {
      if (isPlaying) {
        animatorRef.current?.pause();
      } else {
        animatorRef.current?.play();
      }
      return !isPlaying;
    });
  }, []);

  useEffect(() => {
    animatorRef.current?.pause();

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      animatorRef.current?.pause();
      setIsPlaying(false);
    } else {
      animatorRef.current?.play();
      setIsPlaying(true);
    }
  });

  return (
    <AspectRatioBox aspectHeight={1} aspectWidth={1}>
      <button className="group relative block w-full h-full" onClick={handleClick} type="button">
        <video ref={canvasCallbackRef} src={src} className="w-full" loop muted autoPlay />
        <div
          className={classNames(
            'absolute left-1/2 top-1/2 flex items-center justify-center w-16 h-16 text-white text-3xl bg-black bg-opacity-50 rounded-full transform -translate-x-1/2 -translate-y-1/2',
            {
              'opacity-0 group-hover:opacity-100': isPlaying,
            },
          )}
        >
          <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />
        </div>
      </button>
    </AspectRatioBox>
  );
};

export { PausableMovie };
