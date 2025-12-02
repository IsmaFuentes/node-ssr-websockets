import fs from 'node:fs/promises';
import fsSync from 'node:fs';
import path from 'path';
import express from 'express';

const filesRouter = express.Router();

filesRouter.route('/images').get(async (req, res) => {
  const { orientation } = req.query;

  let root = `${path.resolve('./server')}/images/${orientation}`;
  if (!fsSync.existsSync(root)) {
    // Fallback path a una imagen por defecto..
    root = `${path.resolve('./server')}/images`;
  }

  // Imagenes + Fichero configuración
  const [paths, config] = await Promise.all([
    fs.readdir(root, { withFileTypes: true }),
    fs.readFile('./config.json'),
  ]);

  const files = await Promise.all(
    paths
      .filter((dirent) => dirent.isFile())
      .map((dirent) =>
        fs
          .readFile(`${root}/${dirent.name}`)
          .then(
            (buffer) => 'data:image/jpeg;base64,' + buffer.toString('base64')
          )
      )
  );

  res.status(200).json({ config: JSON.parse(config), files });
});

export default filesRouter;
