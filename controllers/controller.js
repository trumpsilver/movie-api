const axios = require('axios');

exports.getListCinemas = function (req, res) {
    let data = {
        param: {
            url: "/cinema/list",
            keyCache: "main-cinemas1"
        },
        method: "GET"
    }

    postApi(data, result => {
        let groupCinemas = [];
        result.forEach(item => {
            let group = findGroupCinema(groupCinemas, item);
            group.cinemas.push(item);
        });

        res.json(groupCinemas);
    }, res);
}

exports.getListShowingFilms = function (req, res) {
    let data = {
        param: {
            url: "/film/list?status=2",
            keyCache: "showing-film"
        },
        method: "GET"
    }

    postApi(data, result => res.json(result), res);
}

exports.getFilmDetail = function (req, res) {
    const {filmId} = req.query;
    let data = {
        param: {
            url: `/film/detail?film_id=${filmId}`,
            keyCache: `movie-detail${filmId}`
        },
        method: "GET"
    }

    postApi(data, result => res.json(result), res);
}

exports.getCinemaDetail = function (req, res) {
    const {cinemaId} = req.query;
    let data = {
        param: {
            url: `/cinema/detail?cinema_id=${cinemaId}`,
            keyCache: `cinema-detail${cinemaId}`
        },
        method: "GET"
    }

    postApi(data, result => res.json(result), res);
}

exports.getSession = function (req, res) {
    const {filmId, startDate, endDate, cinemaId} = req.query;

    let data = {
        param: {
            url: `/session/film?cinema_id=${cinemaId || 1}
                               &film_id=${filmId}
                               &start_date=${startDate}
                               &end_date=${endDate}
                               &location_id=1`,
            keyCache: "no-cache"
        },
        method: "GET"
    }

    postApi(data, result => res.json(parseSession(result)), res);
}

function handleError(res, error) {
    res
        .status(400)
        .send({error: error.message});
}

function postApi(param, callback, res) {
    axios
        .post('https://www.123phim.vn/apitomapp', param)
        .then(({data}) => {
            data.result
                ? callback(data.result)
                : handleError(res, data.error);
        })
        .catch(error => handleError(res, error));
}

function parseSession(data) {
    let rs = {};
    for (let key in data) {
        for (let days in data[key]) {
            let day = data[key][days];
            for (let cinema in day.cinemas) {
                let session = day.cinemas[cinema];
                let dayKey = days.split("_")[1];
                if (!rs[cinema]) {
                    rs[cinema] = {};
                    rs[cinema][dayKey] = [];
                }
                rs[cinema][dayKey] = (session['versions']['2_0'] || []).map(s => s.session_time.split(' ')[1].slice(0, 5));
            };
        }
    }
    return rs;
}

function findGroupCinema(groupCinemas, cinema) {
    let group = groupCinemas.find(g => g.p_cinema_id === cinema.p_cinema_id);
    if (group) {
        return group;
    }
    group = {
        p_cinema_id: cinema.p_cinema_id,
        p_cinema_name: cinema.p_cinema_name,
        p_cinema_logo: cinema.p_cinema_logo,
        location_id: cinema.location_id,
        cinemas: []
    };
    groupCinemas.push(group);
    return group;
}