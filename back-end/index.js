const express = require('express');
const app = express();
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');

app.use(fileUpload()); // untuk parsing file
app.use(express.urlencoded({ extended: true }));

require('dotenv').config();
const port = process.env.API_PORT || 3001;

const cors = require('cors');
app.use(cors());
app.use(bodyParser.json());

// ROUTES USER
app.use('/api/v1/user', require('./routes/v1/user/user'));

// ROUTES MENU
app.use('/api/v1/menu', require('./routes/v1/menu/menu'));

// ROUTES ORDER
app.use('/api/v1/order', require('./routes/v1/order/order'));

// ROUTES KATEGORI
app.use('/api/v1/kategori', require('./routes/v1/kategori/kategori'));

// ROUTES TABLE
app.use('/api/v1/table', require('./routes/v1/table/table'));

// ROUTES TEST
app.use('/api/v1', require('./routes/test/test'));

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
