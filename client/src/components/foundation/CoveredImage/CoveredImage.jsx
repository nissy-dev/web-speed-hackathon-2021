import React, { useState } from 'react';
import classNames from 'classnames';

/**
 * @typedef {object} Props
 * @property {string} alt
 * @property {string} src
 */

/**
 * アスペクト比を維持したまま、要素のコンテンツボックス全体を埋めるように画像を拡大縮小します
 * @type {React.VFC<Props>}
 */
const CoveredImage = ({ alt, src }) => {
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [containerSize, setContainerSize] = React.useState({ height: 0, width: 0 });

  /** @type {React.RefCallback<HTMLDivElement>} */
  const callbackRef = React.useCallback((el) => {
    setContainerSize({
      height: el?.clientHeight ?? 0,
      width: el?.clientWidth ?? 0,
    });
  }, []);

  /** @type {React.ReactEventHandler<HTMLImageElement>} */
  const handleOnLoadImg = React.useCallback((event) => {
    setImageSize({ width: event.target.offsetWidth, height: event.target.offsetHeight });
  });

  const containerRatio = containerSize.height / containerSize.width;
  const imageRatio = imageSize.height / imageSize.width;

  return (
    <div ref={callbackRef} className="relative w-full h-full overflow-hidden">
      <img
        alt={alt}
        className={classNames('absolute left-1/2 top-1/2 max-w-none transform -translate-x-1/2 -translate-y-1/2', {
          'w-auto h-full': containerRatio > imageRatio,
          'w-full h-auto': containerRatio <= imageRatio,
        })}
        src={src}
        onLoad={handleOnLoadImg}
        loading="lazy"
      />
    </div>
  );
};

export { CoveredImage };
