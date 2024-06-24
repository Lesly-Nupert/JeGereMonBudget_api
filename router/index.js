// Import du routeur Express
const router = require("express").Router();

// MIDDLEWARE AUTHENTIFICATION JWT
const jwt = require("../middlewares/jwt");

// * LES CONTROLEURS
const { mainController, userController, authController  } = require ('../controllers');
    
// * LES ROUTES
// mainController
router.get("/", mainController.homePage);

// * AUTHCONTROLLER
router.post("/signup", authController.signup);
router.post("/login", authController.login);

router.get("/user/:userId", jwt, authController.profileOneUser);
router.patch("/user/update/:userId", jwt, authController.updateOneUser);

router.patch("/user/updatePassword/:userId", jwt, authController.updatePassword);

router.delete("/user/delete/:userId", jwt, authController.deleteOneUser);



// userController
router.get("/users", userController.showAllUsers);



module.exports = router;