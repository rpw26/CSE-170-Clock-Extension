const express = require("express");
const {
  getSites,
  addSite,
  removeSite,
  checkSite
} = require("../controllers/siteController");

const router = express.Router();

router.get("/", getSites);
router.post("/add", addSite);
router.post("/remove", removeSite);
router.post("/check", checkSite);

module.exports = router;