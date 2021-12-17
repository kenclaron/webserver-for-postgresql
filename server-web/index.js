const express = require('express');
const fileUpload = require('express-fileupload');
const productRouter = require('../routes/product.routes');

const PORT = process.env.PORT || 8080;

const app = express();

app.use(fileUpload()); // Для отправки файлов через form на сервер
app.use(express.json()); // Для преобразования тела запроса в JSON при работе сервера
app.use(express.static(__dirname + "/../public")); // Для работы веб-сайта с тест-запросами из-под него
app.use('/api', productRouter);

app.listen(PORT, () => console.info(`Server listening at http://localhost:${PORT}`));