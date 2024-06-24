// Import du routeur Express
const router = require("express").Router();

// * LES CONTROLEURS
const { mainController, userController  } = require ('../controllers');
    
// * LES ROUTES
// mainController
router.get("/", mainController.homePage);

// userController
router.get("/users", userController.showAllUsers);

module.exports = router;