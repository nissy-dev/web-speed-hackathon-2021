const fs = require('fs');
const { createFFmpeg } = require('@ffmpeg/ffmpeg');

const ffmpeg = createFFmpeg({ log: false });

const SOUNDS_DIR = '../../../public/sounds_';
const SOUNDS_OUTDIR = '../../../public/sounds';

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
    await fs.promises.writeFile(outPath, ffmpeg.FS('readFile', outFileName));
    ffmpeg.FS('unlink', fileName);
    ffmpeg.FS('unlink', outFileName);
  }
})();
