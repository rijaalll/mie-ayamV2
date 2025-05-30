const express = require('express');
const path = require('path');
const fs = require('fs');

const router = express.Router();
const imageDir = path.join(__dirname, '../../../assets/uploads/images');

router.get('/:filename', (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(imageDir, filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: 'Image not found' });
  }

  res.sendFile(filePath);
});

module.exports = router;