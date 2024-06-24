const mainController = {
    homePage(req, res) {
      res.status(200).json("Bienvenue sur l'API MonBudget de Lesly !");
    },
  };
  module.exports = mainController;