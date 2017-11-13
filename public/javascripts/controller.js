const service = require('./service');

exports.getListCinemas = function (req, res) {
    let data = service.postApi({
        param: {
            url: "/cinema/list?location_id=1",
            keyCache: "main-cinemas1"
        },
        method: "GET"
    }, function (rs) {
        if(rs.data) {
            let groupCinemas = [];
            rs.data.forEach(function(item) {
                let group = findGroupCinema(groupCinemas, item);
                group.cinemas.push(item);
            });
            res.json(groupCinemas);
        } else {
            res.status(400).send({
                error: rs.error.message
            });
        }
    });
}

exports.getListShowingFilms = function (req, res) {
    let data = service.postApi({
        param: {
            url: "/film/list?status=2",
            keyCache: "showing-film"
        },
        method: "GET"
    }, function (rs) {
        rs.data
            ? res.json(rs.data)
            : res.status(400).send({ error: rs.error.message })
    });
}

exports.getFilmDetail = function (req, res) {
    const filmId = req.query.filmId;
    let data = service.postApi({
        param: {
            url: `/film/detail?film_id=${filmId}`,
            keyCache: `movie-detail${filmId}`
        },
        method: "GET"
    }, function (rs) {
        rs.data
            ? res.json(rs.data)
            : res.status(400).send({ error: rs.error.message })
    });
}

exports.getCinemaDetail = function (req, res) {
    const cinemaId = req.query.cinemaId;
    let data = service.postApi({
        param: {
            url: `/cinema/detail?cinema_id=${cinemaId}`,
            keyCache: `cinema-detail${cinemaId}`
        },
        method: "GET"
    }, function (rs) {
        rs.data
            ? res.json(rs.data)
            : res.status(400).send({ error: rs.error.message })
    });
}

exports.getSession = function (req, res) {
    let filmId = req.query.filmId;
    let startDate = req.query.startDate;
    let endDate = req.query.endDate;
    let cinemaId = req.cinemaId || -1;

    let data = service.postApi({
        param: {
            url: `/session/film?cinema_id=${cinemaId}&film_id=${filmId}&start_date=${startDate}&end_date=${endDate}&location_id=1`,
            // url: "/session/film?cinema_id=-1&film_id=841&start_date=2017-11-10&end_date=20171117&location_id=1",
            keyCache: "no-cache"
        },
        method: "GET"
    }, function (rs) {
        rs.data
            ? res.json(parseSession(rs.data))
            : res.status(400).send({ error: rs.error.message })
    })
}

function parseSession(data) {
    let rs = {};
    for(let i in data) {
        for(let days in data[i]) {
            let date = data[i][days];
            for(let cinema in date.cinemas) {
                let session = date.cinemas[cinema];
                let dateKey = days.split("_")[1];
                if(!rs[cinema]) {
                    rs[cinema] = {};
                    rs[cinema][dateKey] = [];
                }
                rs[cinema][dateKey] = (session['versions']['2_0'] || []).map(function(s) { 
                    return s.session_time.split(' ')[1].slice(0, 5);
                });
            }
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