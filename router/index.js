// Import du routeur Express
const router = require("express").Router();

// Import du middleware JWT
const jwt = require("../middlewares/jwt");

// Import des controllers
const { mainController, authController, accountController  } = require ('../controllers');


// * MAINCONTROLLER (page d'accueil de l'API)
router.get("/", mainController.homePage);

// * AUTHCONTROLLER
router.post("/signup", authController.signup);
router.post("/login", authController.login);

router.get("/user/:userId", jwt, authController.profileOneUser);
router.patch("/user/update/:userId", jwt, authController.updateOneUser);

router.patch("/user/updatePassword/:userId", jwt, authController.updatePassword);

router.delete("/user/delete/:userId", jwt, authController.deleteOneUser);

// * ACCOUNTCONTROLLER
router.post("/user/:userId/addAccount", jwt, accountController.addAccount);





module.exports = router;










