import fs from 'fs';
import http2 from 'http2';

import { app } from './app';
import { insertSeeds } from './seeds';
import { sequelize } from './sequelize';

async function main() {
  const options = {
    key: fs.readFileSync('./keys/localhost-key.pem'),
    cert: fs.readFileSync('./keys/localhost.pem'),
  };
  const server = http2.createServer(options, app);

  // データベースの初期化をします
  await sequelize.sync({
    force: true,
    logging: false,
  });
  await insertSeeds();

  server.listen(Number(process.env.PORT || 3000), '0.0.0.0', () => {
    const address = server.address();
    console.log(`Listening on ${address.address}:${address.port}`);
  });
}

main().catch(console.error);
