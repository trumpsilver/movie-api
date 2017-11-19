var express = require('express');
var router = express.Router();
var controller = require('../controllers/controller');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {title: 'Express'});
});

router.get('/get-list-cinemas', controller.getListCinemas);
router.get('/get-cinema-detail', controller.getCinemaDetail);
router.get('/get-list-showing-films', controller.getListShowingFilms);
router.get('/get-film-detail', controller.getFilmDetail);
router.get('/get-session', controller.getSession);

module.exports = router;
