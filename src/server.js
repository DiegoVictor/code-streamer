import express from 'express';
import fs from 'fs';
import cors from 'cors';
import { Transform, promises } from 'stream';
import zlib from 'zlib';

import { encrypt } from './utils/crypt.js';

const app = express();

app.use(cors());
app.use(express.static('public'));
app.use(express.json());

app.get('/subtitles/:slug', async (request, response) => {
  const { slug } = request.params;
  const filePath = `./subtitles/${slug}`;

  const stat = await fs.promises.stat(filePath).then((file) => file).catch(() => null);
  if (!stat) {
    return response.status(404).json({
      message: `The file ${slug} was not found`,
    });
  }

  return fs.createReadStream(filePath).pipe(response);
});

app.get('/videos/:slug', async (request, response) => {
  const { slug } = request.params;
  const { range } = request.headers;

  if (!range) {
    return response.status(400).json({
      message: 'Range header is required',
    });
  }

  const filePath = `./media/${slug}`;
  const stat = await fs.promises.stat(filePath).then((file) => file).catch(() => null);

  if (!stat) {
    return response.status(404).json({
      message: `The file ${slug} was not found`,
    });
  }
  const { size: fileSize } = stat;

  const chunkSize = 1024 * 48;
  const start = Number(range.replace(/\D/gi, ''));
  const end = Math.min(start + chunkSize, fileSize - 1);

  const stream = fs.createReadStream(filePath, { start, end });

  return stream
    .on('open', () => {
      const transform = new Transform({
        transform(chunk, _, callback) {
          const cipherText = encrypt(chunk, '6n2347856n234785nc623487c56n2347');

          callback(null, cipherText);
        },
      });

      const steps = [stream, transform];
      const headers = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Type': 'application/octet-stream',
      };

      const { 'accept-encoding': acceptEncoding } = request.headers;
      if (acceptEncoding && acceptEncoding.includes('gzip')) {
        steps.push(zlib.createGzip());
        headers['Content-Encoding'] = 'gzip';
      }

      response.writeHead(206, headers);
      steps.push(response);

      promises.pipeline(steps);
    })
    .on('error', () => {
      response.status(500).json({
        message: 'Internal Server Error',
      });
    });
});

app.listen(process.env.PORT, () => {
  process.stdout.write(`\nRunning at: http://localhost:${process.env.PORT}\n`);
});
