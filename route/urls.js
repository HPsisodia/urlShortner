const express = require('express');
const router = express.Router();

const { shortUrl, getAllUrl, redirect } = require("../controllers/urls");

router.post('/short/url', shortUrl);
router.get('/get-all-url', getAllUrl);
router.get('/:slug', redirect);


module.exports = router;