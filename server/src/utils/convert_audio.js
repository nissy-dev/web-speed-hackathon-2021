const fs = require('fs');
const { createFFmpeg } = require('@ffmpeg/ffmpeg');
const decode = require('audio-decode');
require('vorbis.js');

const ffmpeg = createFFmpeg({ log: false });

const SOUNDS_DIR = '../../../public/sounds_';
const SOUNDS_OUTDIR = '../../../public/sounds';

const mean = (nums) => {
  let total = 0;
  for (const n of nums) {
    total += n;
  }
  return total / nums.length;
};

const zip = (arr, ...args) => Array.from(arr).map((value, idx) => [value, ...args.map((arr) => arr[idx])]);

const chunk = (arr, chunkSize = 1, cache = []) => {
  const tmp = [...arr];
  if (chunkSize <= 0) return cache;
  while (tmp.length) cache.push(tmp.splice(0, chunkSize));
  return cache;
};

/**
 * @param {Uint8Array} data
 * @returns {Promise<{ max: number, peaks: number[] }}
 */
async function calculate(data) {
  const buffer = await decode(data);
  // 左の音声データの絶対値を取る
  const leftData = buffer.getChannelData(0).map(Math.abs);
  // 右の音声データの絶対値を取る
  const rightData = buffer.getChannelData(1).map(Math.abs);

  // 左右の音声データの平均を取る
  const normalized = zip(leftData, rightData).map(mean);
  // 100 個の chunk に分ける
  const chunks = chunk(normalized, Math.ceil(normalized.length / 100));
  // chunk ごとに平均を取る
  const peaks = chunks.map(mean);
  // chunk の平均の中から最大値を取る
  const maxPeaks = Math.max(...peaks);

  return { max: maxPeaks, peaks };
}

/**
 * @param {Uint8Array} data
 * @param {object} options
 * @param {number} [options.extension]
 * @returns {string}
 */
async function createSoundWaveSVG(data) {
  const { max, peaks } = await calculate(data);

  return `
<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" viewBox="0 0 100 1">
${peaks
  .map((peak, idx) => {
    const ratio = (peak / max).toFixed(4);
    return `<rect key="${idx}" fill="#2563EB" height="${ratio}" width="1" x="${idx}" y="${(1 - ratio).toFixed(4)}" />`;
  })
  .join('')}
</svg>`.trim();
}

const listFiles = (dir) =>
  fs
    .readdirSync(dir, { withFileTypes: true })
    .flatMap((dirent) => (dirent.isFile() ? [`${dir}/${dirent.name}`] : listFiles(`${dir}/${dirent.name}`)));

// delete old files
listFiles(SOUNDS_OUTDIR).forEach((filePath) => {
  fs.unlink(filePath, function (err) {
    if (err) {
      throw err;
    }
    console.log(`deleted ${filePath}`);
  });
});

(async () => {
  for (const filePath of listFiles(SOUNDS_DIR)) {
    if (ffmpeg.isLoaded() === false) {
      await ffmpeg.load();
    }
    const fileName = filePath.split('/').reverse()[0];
    const outFileName = fileName.slice(0, -3) + 'ogg';
    ffmpeg.FS('writeFile', fileName, new Uint8Array(fs.readFileSync(filePath)));
    await ffmpeg.run('-i', fileName, '-acodec', 'libvorbis', '-b:a', '96k', '-vn', outFileName);
    const outPath = filePath.replace('sounds_', 'sounds').slice(0, -3) + 'ogg';
    const outSvgPath = filePath.replace('sounds_', 'sounds').slice(0, -3) + 'svg';
    const data = ffmpeg.FS('readFile', outFileName);
    const svgData = await createSoundWaveSVG(data);
    Promise.all([fs.promises.writeFile(outPath, data), fs.promises.writeFile(outSvgPath, svgData)]);
    ffmpeg.FS('unlink', fileName);
    ffmpeg.FS('unlink', outFileName);
  }
})();
