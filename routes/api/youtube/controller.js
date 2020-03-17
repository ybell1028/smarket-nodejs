var {google} = require('googleapis');
var request = require('request');
var querystring = require('querystring');
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
            console.dir(req.query);
            console.log('검색 성공');
            console.log('statusCode : ' + response.statusCode);
            res.status(response.statusCode);
            res.json(JSON.parse(body));
        }
        else {
            console.dir(req.query);
            console.log('검색 실패')
            console.log('error : ' + res.statusCode);
            res.status(response.statusCode);
            res.json({success:false, message:err});
        }
    });
}