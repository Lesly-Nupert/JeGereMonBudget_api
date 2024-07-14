// Import du routeur Express
const router = require("express").Router();

// Import du middleware JWT
const jwt = require("../middlewares/jwt");

// Import des controllers
const { mainController, authController, accountController, incomeController, expenseController, contactController  } = require ('../controllers');


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

router.get("/user/:userId/account/:accountId/oneAccount", jwt, accountController.getOneAccount);

router.get("/user/:userId/account/:accountId", jwt, accountController.getOneAccountWithTransactions);

router.get("/user/:userId/accounts", jwt, accountController.getAllAccountsWithTransactions);


// * INCOME CONTROLLER
router.post("/user/:userId/account/:id/addIncome", jwt, incomeController.addIncomeAndIncrementAccountBalance);

router.patch("/user/:userId/account/:accountId/transaction/:transactionId/updateIncome", jwt, incomeController.updateIncomeAndIncrementAccountBalance);

router.delete("/user/:userId/account/:accountId/transaction/:transactionId/deleteIncome", jwt, incomeController.deleteIncomeAndDecrementAccountBalance);

router.get("/user/:userId/account/:accountId/transaction/:transactionId/oneIncome", jwt, incomeController.getOneIncome);


// * EXPENSE CONTROLLER
router.post("/user/:userId/account/:id/addExpense", jwt, expenseController.addExpenseAndIncrementAccountBalance);

router.patch("/user/:userId/account/:accountId/transaction/:transactionId/updateExpense", jwt, expenseController.updateExpenseAndIncrementAccountBalance);

router.delete("/user/:userId/account/:accountId/transaction/:transactionId/deleteExpense", jwt, expenseController.deleteExpenseAndDecrementAccountBalance);

router.get("/user/:userId/account/:accountId/transaction/:transactionId/oneExpense", jwt, expenseController.getOneExpense);


// * ContactController
router.post("/contact", contactController.sendEmail);

module.exports = router;












