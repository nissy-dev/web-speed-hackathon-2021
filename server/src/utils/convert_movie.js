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

(async () => {
  for (const filePath of listFiles(MOVIE_DIR)) {
    if (ffmpeg.isLoaded() === false) {
      await ffmpeg.load();
    }
    const fileName = filePath.split('/').reverse()[0];
    const outFileName = fileName.slice(0, -3) + 'gif';
    ffmpeg.FS('writeFile', fileName, new Uint8Array(fs.readFileSync(filePath)));
    // await ffmpeg.run('-i', fileName, '-vcodec', 'libx264', '-r', '5', '-an', outFileName);
    // ffmpeg -y -i file.mp4 -vf palettegen palette.png
    // ffmpeg -y -i file.mp4 -i palette.png -filter_complex paletteuse -r 10 -s 320x480 file.gif
    await ffmpeg.run('-i', fileName, '-vcodec', 'libx264', '-r', '5', '-vf', 'scale=640:-1', '-an', outFileName);
    const outPath = filePath.replace('movies_', 'movies').slice(0, -3) + 'gif';
    console.log(`converted ${filePath} to ${outPath}`);
    await fs.promises.writeFile(outPath, ffmpeg.FS('readFile', outFileName));
    console.log(`converted ${filePath} to ${outPath}`);
    ffmpeg.FS('unlink', fileName);
    ffmpeg.FS('unlink', outFileName);
  }
})();
