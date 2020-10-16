const router = new require("express").Router();
// bcrypt est une librairie de cryptographie utilisée ici pour encrypter les mots de passe
const bcrypt = require("bcrypt");
const userModel = require("./../models/Users");
// auth est une librairie custom pour gérer les jetons d'authentification (a.k.a tokens: JWT : JSON Web Token)
const auth = require("./../auth");
// uploader est un middleware, cad une fonction qui s'insère entre une requête http et une réponse http
const uploader = require("./../config/cloudinary");

// COMPRENDRE LES CODES DE STATUS HTTP
// https://kinsta.com/blog/http-status-codes/
// https://developer.mozilla.org/fr/docs/Web/HTTP/Status

router.get("/signout", (req, res) => {

    const x = req.session.destroy();
    res.json(x);
});

router.get("/get-user-by-token", (req, res) => {
    try {
        // recup les données de user  et les decode 
        const user = auth.decodeToken(req.header("x-authenticate"));
        const userId = user.infos._id;
        res.redirect("/users/" + userId);

    } catch (err) {
        res.status(500).json(err.message);
    }

});

router.post("/login", async (req, res, next) => {
    const userInfos = req.body; //
    // check que mail et mdp sont renseignés
    if (!userInfos.email || !userInfos.password) {
        // never trust user input !!!
        // si non : retourner message warning au client
        res.status(401).json({
            msg: "Identifiants incorrects",
            level: "error",
        });
    }
    // si oui : vérifier que mail et mdp correspondent en bdd
    // 1 - récupérer l'utilisateur avec le mail fourni
    console.log(req.session);
    userModel
        .findOne({
            email: userInfos.email
        })
        .then((user) => {
            if (!user) {
                // vaut null si pas d'user trouvé pour ce mail
                // si non .. retiourner une erreur au client
                return res.status(401).json({
                    msg: "Identifiants incorrects",
                    level: "error",
                });
            }
            // si oui comparer le mdp crypté stocké en bdd avec la chaîne en clair envoyée depuis le formulaire
            const checkPassword = bcrypt.compareSync(
                userInfos.password, // password provenant du form "texte plein"
                user.password // password stocké en bdd (encrypté)
            ); // checkPassword vaut true || false

            // si le mdp est incorrect: retourner message error sur signin
            if (checkPassword === false) {
                // req.flash("error", "Identifiants incorrects");
                return res.status(401).json({
                    msg: "Identifiants incorrects",
                    level: "error",
                });
            }

            // si oui : stocker les infos de l'user en session pour lui permettre de naviguer jusqu'au signout
            const {
                _doc: clone
            } = {
                ...user
            }; // je clone l'user
            delete clone.password; // par sécurité, je supprime le mdp du clone (pas besoin de le stocker ailleurs qu'en bdd)

            req.session.currentUser = clone; // j'inscris le clone dans la session (pour maintenir un état de connexion)
            console.log(req.session)
            const token = auth.createToken(user, req.ip); // createToken retourne un jeton (token) créé avec JWT

            return res
                .header("x-authenticate", token) // je renvoie le token au client dans l'entête de la réponse pour l'authentification
                .status(200)
                .send({
                    user: clone,
                    token,
                    msg: "logged in !",
                    level: "success"
                });
        })
        .catch(next);
});

/**
 * @see : https://www.youtube.com/watch?v=O6cmuiTBZVs
 */


router.post("/signup", uploader.single("avatar"), async (req, res, next) => {
    const user = req.body;
    console.log(req.body)
    if (req.file) user.avatar = req.file.path; // on associe l'image stockée sur cloudinary à l'user à insérer en base de données

    if (!user.first_name || !user.last_name || !user.password || !user.email) {
        return res.status(422).json({
            msg: "Merci de remplir tous les champs requis.",
            level: "warning",
        });
    } else {
        try {
            const previousUser = await userModel.findOne({
                email: user.email
            });
            // console.log(previousUser);
            if (previousUser) {
                return res.status(422).json({
                    msg: "Désolé, cet email n'est pas disponible.",
                    level: "warning",
                });
            }

            // si le programme est lu jusqu'ici, on converti le mot de passe en chaîne cryptée
            const salt = bcrypt.genSaltSync(10);
            const hashed = bcrypt.hashSync(user.password, salt);
            // console.log("password crypté >>>", hashed);
            user.password = hashed; // on remplace le mot de passe "en clair" par sa version cryptée

            // finalement on insère le nouvel utilisateur en base de données
            await userModel.create(user);
            return res.status(200).json({
                msg: "signed up !",
                level: "success"
            });
        } catch (err) {
            next(err);
        }
    }
});

module.exports = router;