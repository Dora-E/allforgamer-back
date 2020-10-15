var express = require('express');
const GameModel = require('../models/Jeux');
var router = express.Router();

router.get('/', async (req, res, next) => {
    try {
        const games = await GameModel.find()
        res.json(games);

    } catch (err) {
        next(err);
    }
});

router.get("/:id", async (req, res, next) => {
    try {
        const getGame = await GameModel.findById(req.params.id);
        res.json(getGame);
    } catch (err) {
        next(err)
    }
})
router.get("/date", async (req, res, next) => {
    try {
        const showGame = await GameModel.find(req.params.date);
        res.json(showGame);
    } catch (err) {
        next(err)
    }
})

router.post("/", async (req, res, next) => {
    try {
        const newGame = await GameModel.create(req.body);
        res.json(newGame)

    } catch (err) {
        next(err)
    }
});
router.patch("/:id", async (req, res, next) => {
    try {
        const updateGame = await GameModel.findByIdAndUpdate(
            req.params.id,
            req.body, {
                new: true
            }
        );
        res.json(updateGame);
    } catch (err) {
        next(err);
    }
})
router.delete("/:id", async (req, res, next) => {
    try {
        const deleteGame = await GameModel.findByIdAndDelete(req.params.id);
        res.json(deleteGame)
    } catch (err) {
        next(err)
    }
})


module.exports = router;