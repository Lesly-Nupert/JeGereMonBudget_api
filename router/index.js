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

router.delete("/user/delete/:userId", jwt, authController.deleteUserWithAccountsAndTransactions);

// * ACCOUNT CONTROLLER
router.post("/user/:userId/addAccount", jwt, accountController.addAccount);

router.patch("/user/:userId/account/:accountId/updateAccount", jwt, accountController.updateAccount);

router.delete("/user/:userId/account/:accountId/deleteAccount", jwt, accountController.deleteAccountWithTansactions);

router.get("/user/:userId/account/:accountId", jwt, accountController.getOneAccountWithTransactions);

router.get("/user/:userId/allAccountsNames", jwt, accountController.getAllAccountsNames);


// * TRANSACTION CONTROLLER
// * Revenus
router.post("/user/:userId/account/:id/addIncome", jwt, transactionController.addIncome);

router.patch("/user/:userId/account/:accountId/transaction/:transactionId/updateIncome", jwt, transactionController.updateIncome);

router.delete("/user/:userId/account/:accountId/transaction/:transactionId/deleteIncome", jwt, transactionController.deleteIncome);

router.get("/user/:userId/account/:accountId/transaction/:transactionId/oneIncome", jwt, transactionController.getOneIncome);

// * Depenses
router.post("/user/:userId/account/:id/addExpense", jwt, transactionController.addExpense);

router.patch("/user/:userId/account/:accountId/transaction/:transactionId/updateExpense", jwt, transactionController.updateExpense);

router.delete("/user/:userId/account/:accountId/transaction/:transactionId/deleteExpense", jwt, transactionController.deleteExpense);

router.get("/user/:userId/account/:accountId/transaction/:transactionId/oneExpense", jwt, transactionController.getOneExpense);












// * Test apres seed
router.get("/test", testController.test);

module.exports = router;












