require('dotenv').config();
const { User, Account, Transaction } = require('../models');
const nodemailer = require('nodemailer');
const emailValidator = require("email-validator");
// Bibliothque qui hache les mots de passe
const bcrypt = require("bcryptjs");
const salt = 10;
// Authentification des utilisateurs via JWT
const jwt = require("jsonwebtoken");
// Sanitize les données pour contrer attaque XSS
const sanitizeHtml = require('sanitize-html');

const authController = {
  // * INSCRIPTION 
  signup: async (req, res) => {
    try {
      const username = sanitizeHtml(req.body.username);
      const email = sanitizeHtml(req.body.email);
      const password = req.body.password;
      const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*\W).{8,12}$/;

      if (!emailValidator.validate(email)) {
        return res.status(400).json({ error: "Adresse email invalide." });
      }

      if (!username) {
        return res.status(400).json({ error: "Le nom d'utilisateur est obligatoire." });
      }

      if (!password) {
        return res
          .status(400)
          .json({ error: "Le mot de passe est obligatoire." });
      }

      if (!passwordRegex.test(password)) {
        return res
          .status(400)
          .json({
            error:
              "Le mot de passe doit contenir entre 8 et 12 caractères, avec au moins une lettre majuscule, un chiffre et un caractère spécial",
          });
      }
      const hashedPassword = await bcrypt.hash(password, salt);
      await User.create({ username, email, password: hashedPassword });
      console.log(username, email, hashedPassword);

      res.status(201).json({ message: "Inscription validée !" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erreur serveur" });
    }
  },

  // * CONNEXION 
  async login(req, res) {
    try {
      const email = sanitizeHtml(req.body.email);
      const password = req.body.password;
      const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*\W).{8,12}$/;

      if (!emailValidator.validate(email)) {
        return res.status(400).json({ error: "Adresse email invalide." });
      }

      if (!password) {
        return res
          .status(400)
          .json({ error: "Le mot de passe est obligatoire." });
      }

      if (!passwordRegex.test(password)) {
        return res
          .status(400)
          .json({
            error:
              "Le mot de passe doit contenir entre 8 et 12 caractères, avec au moins une lettre majuscule, un chiffre et un caractère spécial",
          });
      }

      const user = await User.findOne({ where: { email: email } });

      if (!user || !(await bcrypt.compare(password, user.password))) {
        res.status(401).json({ error: "Utilisateur ou mot de passe incorrect !" });
      } else {
        // Récupère les comptes de l'utilisateur
        const accounts = await Account.findAll({ where: { user_id: user.id } });

        // Récupère les transactions de l'utilisateur
        const transactions = await Transaction.findAll({ where: { user_id: user.id } });

        const token = jwt.sign(
          {
            userId: user.id,
            // Récupère les id des comptes et des transactions avec 
            // la fonction map de javascript qui permet de parcourir un tableau. 
            accountIds: accounts.map(account => account.id),
            transactionIds: transactions.map(transaction => transaction.id),
          },
          process.env.TOKEN_SECRET,
          { expiresIn: "1h" }
        );

        res.status(200).json({
          message: "Connexion réussie !",
          token,
          userId: user.id,
          accountIds: accounts.map(account => account.id),
          transactionIds: transactions.map(transaction => transaction.id),
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erreur serveur" });
    }
  },

  // * INFOS PERSONNELLES D'UN UTILISATEUR
  profileOneUser: async (req, res) => {
    try {
      const userId = req.params.userId;
      const userDetails = await User.findOne({ where: { id: userId } });
      if (!userDetails) {
        res.status(404).json({ error: "Utilisateur non trouvé" });
        return;
      }
      res.status(200).json(userDetails);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erreur serveur" });
    }
  },

  // * MISE A JOUR DU NOM D'UTILISATEUR ET DE L'EMAIL
  updateOneUser: async (req, res) => {
    try {
      const userId = req.params.userId;
      const updateData = {
        username: sanitizeHtml(req.body.username),
        email: sanitizeHtml(req.body.email),
      };

      await User.update(updateData, { where: { id: userId } });
      res
        .status(200)
        .json({ message: "Compte utilisateur mis à jour avec succès" });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({
          error: "Erreur serveur lors de la mise à jour du compte utilisateur",
        });
    }
  },

  // * MISE A JOUR DU MOT DE PASSE
  updatePassword: async (req, res) => {
    try {
      const { userId } = req.user;
      const { oldPassword, newPassword } = req.body;
      console.log(req.body);
      const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*\W).{8,12}$/;

      if (!oldPassword || !newPassword) {
        return res
          .status(400)
          .json({ error: "Le mot de passe est obligatoire." });
      }

      if (!passwordRegex.test(oldPassword) || !passwordRegex.test(newPassword)) {
        return res
          .status(400)
          .json({
            error:
              "Le mot de passe doit contenir entre 8 et 12 caractères, avec au moins une lettre majuscule, un chiffre et un caractère spécial",
          });
      }

      const user = await User.findOne({ where: { id: userId } });

      if (!user || !(await bcrypt.compare(oldPassword, user.password))) {
        return res
          .status(401)
          .json({ error: "Ancien mot de passe incorrect." });
      }
      const hashedNewPassword = await bcrypt.hash(newPassword, salt);
      await User.update({ password: hashedNewPassword }, { where: { id: userId } });
      
      console.log(hashedNewPassword, userId, newPassword);

      res.status(200).json({ message: "Mot de passe modifié avec succès." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erreur serveur" });
    }
  },

  // * SUPPRESSION D'UN UTILISATEUR AVEC SES COMPTES ET SES TRANSACTIONS (delete on cascade)
  deleteUserWithAccountsAndTransactions: async (req, res) => {
    try {
      const user = await User.findByPk(req.params.userId);
      if (!user) {
        return res.status(404).json("Utilisateur non trouvé");
      } else {
        await User.destroy({ where: { id: req.params.userId } });
        res.status(200).json("Utilisateur supprimé !");
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erreur serveur" });
    }
  },

  // * MOT DE PASSE OUBLIE
  forgotPassword: async (req, res) => {
    try {
      const email = sanitizeHtml(req.body.email);

      if (!emailValidator.validate(email)) {
        return res.status(400).json({ error: "Adresse email invalide." });
      }

      const user = await User.findOne({ where: { email: email } });

      if (!user) {
        return res.status(404).json({ error: "Utilisateur non trouvé." });
      }

      const token = jwt.sign(
        { userId: user.id },
        process.env.TOKEN_SECRET,
        { expiresIn: "1h" }
      );

      // Configurer le transporteur Nodemailer
      let transporter = nodemailer.createTransport({
        host: 'smtp.zoho.eu',
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAIL_USER_PROD,
          pass: process.env.EMAIL_PASS_PROD
        },
        tls: {
          rejectUnauthorized: false
        }
      });

      let mailOptions = {
        from: process.env.EMAIL_USER_PROD,
        to: email,
        subject: `Réinitialisation du mot de passe de mon compte JeGereMonBudget`,
        text: `Cliquez sur ce lien pour réinitialiser votre mot de passe: ${process.env.BASE_URL_PROD}/resetPassword/${token}`
      };

      console.log('BASE_URL_PROD:', process.env.BASE_URL_PROD);


      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log("Erreur lors de l'envoi de l'email: ", error);
          return res.status(500).json("Erreur lors de l'envoi de l'email: " + error.message);
        }
        console.log('Email envoyé avec succès: ' + info.response);
        res.json('Email envoyé avec succès!');
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erreur serveur" });
    }
  },

  // * REINITIALISATION DU MOT DE PASS
  resetPassword: async (req, res) => {
    try {
      const resetToken = req.params.resetToken;
      const { userId } = jwt.verify(resetToken, process.env.TOKEN_SECRET);
      const newPassword = req.body.newPassword;
      const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*\W).{8,12}$/;

      if (!newPassword) {
        return res
          .status(400)
          .json({ error: "Le mot de passe est obligatoire." });
      }

      if (!passwordRegex.test(newPassword)) {
        return res
          .status(400)
          .json({
            error:
              "Le mot de passe doit contenir entre 8 et 12 caractères, avec au moins une lettre majuscule, un chiffre et un caractère spécial",
          });
      }

      const hashedNewPassword = await bcrypt.hash(newPassword, salt);
      await User.update({ password: hashedNewPassword }, { where: { id: userId } });

      res.status(200).json({ message: "Mot de passe réinitialisé avec succès." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erreur serveur" });
    }
  },

};

module.exports = authController;