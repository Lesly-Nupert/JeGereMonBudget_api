// Import du routeur Express
const router = require("express").Router();

// Import du middleware JWT
const jwt = require("../middlewares/jwt");

// Import des controllers
const { mainController, authController, accountController, transactionController, testController  } = require ('../controllers');


// * MAINCONTROLLER (page d'accueil de l'API)
router.get("/", mainController.homePage);

// * AUTH CONTROLLER
router.post("/signup", authController.signup);
router.post("/login", authController.login);

router.get("/user/:userId", jwt, authController.profileOneUser);
router.patch("/user/update/:userId", jwt, authController.updateOneUser);

router.patch("/user/updatePassword/:userId", jwt, authController.updatePassword);

router.delete("/user/delete/:userId", jwt, authController.deleteOneUser);

// * ACCOUNT CONTROLLER
router.post("/user/:userId/addAccount", jwt, accountController.addAccount);

// * TRANSACTION CONTROLLER
router.post("/account/:id/addIncome", jwt, transactionController.addIncome);





// * Test apres seed
router.get("/test", testController.test);

module.exports = router;










