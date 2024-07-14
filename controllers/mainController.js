const mainController = {
    homePage(req, res) {
      res.status(200).json("Bienvenue sur l'API JeGereMonBudget !");
    },
  };
  module.exports = mainController;