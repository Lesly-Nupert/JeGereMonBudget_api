const nodemailer = require('nodemailer');
const emailValidator = require("email-validator");

// Configurer le transporteur Nodemailer
// https://www.npmjs.com/package/nodemailer
// La doc de Nodemailer prévient des problèmes avec Gmail qui demande OAuth2 donc j'ai choisi Zoho Mail
// https://www.zoho.com/fr/mail/help/zoho-smtp.html
let transporter = nodemailer.createTransport({
    host: 'smtp.zoho.eu',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER_PROD,
        pass: process.env.EMAIL_PASS_PROD
    },
    // Pour éviter les erreurs avec les certificats SSL/TLS
    // https://nodemailer.com/smtp/
    tls: {
        rejectUnauthorized: false
    }
});

const sendEmail = (req, res) => {
    const { email, message } = req.body;

    if (!emailValidator.validate(email)) {
        return res.status(400).json({ error: "Adresse email invalide." });
    }

    if (!message) {
        return res.status(400).json({ error: "Le message est obligatoire." });
    }

    let mailOptions = {
        // Nodemailer se connecte au serveur SMTP de Zoho Mail, 
        // celui-ci vérifie les informations d'identification
        from: process.env.EMAIL_USER_PROD,
        // Zoho Mail envoie le message à l'adresse e-mail spécifiée
        to: process.env.RECEIVER_EMAIL_PROD,
        // L'adresse e-mail de l'expéditeur est ajoutée à la réponse
        replyTo: email,
        subject: `Message formulaire de contact de JeGereMonBudget`,
        text: message
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log("Erreur lors de l'envoi de l'email: ", error);
            return res.status(500).json("Erreur lors de l'envoi de l'email: " + error.message);
        }
        console.log('Email envoyé avec succès: ' + info.response);
        res.json('Email envoyé avec succès!');
    });
};

module.exports = { sendEmail };

