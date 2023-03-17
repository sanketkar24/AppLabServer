const express = require('express');
const postController = require('../controllers/postControllers');
const router = express.Router();

// @route GET & POST /posts/
const { checkToken } = require("../auth/token_validation");
router.route("/reg").post(postController.regUser);
router.route("/login").post(postController.login);
router.route("/user").get(postController.getUser);
router.post("/reset",checkToken,postController.reset);
router.route("/findStartup").post(postController.findStartupByID)
router.route("/listMentors/:key").post(postController.listMentors)
router.route("/insertUpdateMsg").get(postController.insertUpdateMsg)
// router.route("/allMovies/:name").get(postController.findMovieByName);
// router.route("/getReview/:id").get(postController.getReview);
// router.route("/postReview").post(postController.postReview);
// router.route("/insert").post(postController.insertToTable);
// router.route("/getpopular").get(postController.getPop);
// router.route("/details/:id").get(postController.getById);
// router.route("/:genre").get(postController.getByGenre);
// router.route("/countReview/:id").get(postController.getCount);
// router.route("/getCast/:id").get(postController.getCast);
module.exports=router;