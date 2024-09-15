import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors'; // Importar o cors
import { UrlShortenerController } from './interfaces/UrlShortenerController';

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors()); // Usar o cors

const controller = new UrlShortenerController();

app.post('/shorten', (req, res) => controller.shorten(req, res));
app.get('/stats/:shortId', (req, res) => controller.getStats(req, res));
app.get('/urls', (req, res) => controller.getAllUrls(req, res));
app.get('/:shortId', (req, res) => controller.redirect(req, res));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
