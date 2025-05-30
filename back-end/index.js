const express = require('express');
const app = express();
const bodyParser = require('body-parser');

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

// ROUTES IMAGE
app.use('/api/v1/image', require('./routes/v1/images/image'));

// ROUTES TEST
app.use('/api/v1', require('./routes/test/test'));

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
