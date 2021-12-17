const fs = require('fs');
const { createFFmpeg } = require('@ffmpeg/ffmpeg');

const ffmpeg = createFFmpeg({ log: false });

const MOVIE_DIR = '../../../public/movies_';
const MOVIE_OUTDIR = '../../../public/movies';

const listFiles = (dir) =>
  fs
    .readdirSync(dir, { withFileTypes: true })
    .flatMap((dirent) => (dirent.isFile() ? [`${dir}/${dirent.name}`] : listFiles(`${dir}/${dirent.name}`)));

// delete old files
listFiles(MOVIE_OUTDIR).forEach((filePath) => {
  fs.unlink(filePath, function (err) {
    if (err) {
      throw err;
    }
    console.log(`deleted ${filePath}`);
  });
});

listFiles(MOVIE_DIR).forEach(async (filePath, index) => {
  if (index > 0) {
    return;
  }
  await ffmpeg.load();
  console.log('Waai');
  const fileName = filePath.split('/').reverse()[0];
  ffmpeg.FS('writeFile', 'file', new Uint8Array(fs.readFileSync(filePath)));
  // -r はフレームレート
  // -vcodec エンコード方法
  // -vfはリサイズとか
  await ffmpeg.run('-i', 'file', '-t', '5', '-r', '5', '-vf', 'scale=640:-1', '-vcodec', 'h264', '-an', fileName);
  const outPath = filePath.replace('movies_', 'movies');
  await fs.promises.writeFile(outPath, ffmpeg.FS('readFile', fileName));
  return;
});
