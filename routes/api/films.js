const router = require('express').Router();

const { Film } = require('../../db');

/**READ ENPOINT*/

router.get('/', async (req, res) => {
    const films = await Film.findAll();
    res.json(films);
});

/**CREATE ENDPOINT */

router.post('/', async (req, res) => {
    const film = await Film.create(req.body);
    res.json(film);
});

/**EDIT ENDPOINT */

router.put('/:filmId', async (req, res) => {
    await Film.update(req.body, {
        where: { id: req.params.filmId }
    });
    res.status(200).json( { success: 'Se ha modificado'});
});


/*DELETE ENDPOINT*/

router.delete('/:filmId', async (req, res) =>{
    await Film.destroy({
        where: { id: req.params.filmId }
    });
    res.status(200).json( { success: 'Se ha borrado'});
});

module.exports = router;