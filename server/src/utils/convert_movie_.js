const imagemin = import('imagemin');
const imageminGifsicle = require('imagemin-gifsicle');

(async () => {
  await imagemin(['../../../public/movies_/*.gif'], {
    destination: '../../../public/movies',
    plugins: [imageminGifsicle()],
  });

  console.log('Images optimized');
})();
