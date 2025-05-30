const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    res.status(200).json({ status: 'OK',
        message: {
            version: '1.0.0',
            message: 'API work cuy'
        }
     });
});
    
module.exports = router;