const http = require('http');

let rawData = '';
exports.postApi = function (data, callback) {

    const postData = JSON.stringify(data);

    const options = {
        hostname: 'www.123phim.vn',
        port: 80,
        path: '/apitomapp',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    };
    const req = http.request(options, (res) => {
        rawData = '';
        res.setEncoding('utf8');
        res.on('data', (chunk) => {rawData += chunk});
        res.on('end', (data) => {
            try {
                var rs = JSON.parse(rawData);
                callback({
                    data: rs.result
                });
            } catch (e) {
                callback({error: e});
            }
        });
    });

    req.on('error', (e) => {
        callback({error: e.message});
    });

    // write data to request body
    req.write(postData);
    req.end();
}