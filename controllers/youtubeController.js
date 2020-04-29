var {google} = require('googleapis');
var request = require('request');
var querystring = require('querystring');
var util = require('../middleware/util');
const YOUTUBE_API_KEY = 'AIzaSyC7YY58-0d5LffCoYBHUlYZCqFKOJawxwQ';

exports.search = (req, res) => {

	var options = {
		q: req.query.query,
		part: "snippet",
		key: YOUTUBE_API_KEY,
		type: "video",
		maxResults: req.query.maxResults,
		regionCode: "KR"
	};

	var youtubeUrl = 'https://www.googleapis.com/youtube/v3/search?' + querystring.stringify(options);

	console.log(youtubeUrl);

	request.get(youtubeUrl, function(err, response, body){
		if(!err && response.statusCode == 200){
            console.log('유튜브 API 검색 성공');
            let data = JSON.parse(body)
            res.status(response.statusCode);
            res.json(util.successTrue(data));
        }
        else {
            console.dir(err);
            console.log('유튜브 API 검색 실패');
            res.status(response.statusCode);
            res.json(util.successFalse(err, '유튜브 API 검색 실패'));
        }
    });
}