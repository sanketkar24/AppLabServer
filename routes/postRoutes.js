const express = require('express');
const postController = require('../controllers/postControllers');
const router = express.Router();

// @route GET & POST /posts/
const { checkToken } = require("../auth/token_validation");

//register
router.route("/reg").post(postController.regUser);
router.route("/registerStartup").post(postController.registerStartup);

//login
router.route("/login").post(postController.login);
router.route("/startuplogin").post(postController.StartupLogin);

//getDetails
router.route("/userDetails").get(postController.getUser);
router.route("/startupDetails").get(postController.getStartup);

//Services
router.route("/getPastServices").get(postController.getPastServices);
router.route("/insertServices").get(postController.insertServices);
router.route("/getAllServices").get(postController.getAllServices);

//Hiring
router.route("/insertHiringMessage").post(postController.insertHiringMessage);
router.route("/getPastHiring").post(postController.getPastHiring);
router.route("/getAllHiring").get(postController.getAllHiring);

//Feedback
router.route("/getFeedback").get(postController.getFeedback);


router.post("/reset",checkToken,postController.reset);
router.route("/findStartup").post(postController.findStartupByID)
router.route("/listMentors/:key").post(postController.listMentors)
router.route("/insertUpdateMsg").get(postController.insertUpdateMsg)



// router.route("/allMovies/:name").get(postController.findMovieByName);
// router.route("/getReview/:id").get(postController.getReview);


// router.route("/getpopular").get(postController.getPop);
// router.route("/details/:id").get(postController.getById);
// router.route("/:genre").get(postController.getByGenre);
// router.route("/countReview/:id").get(postController.getCount);
// router.route("/getCast/:id").get(postController.getCast);
module.exports=router;