let admin = require("firebase-admin");
let request = require("request");
let cheerio = require("cheerio");

exports.testPostAPI = (req, res) => {
    //승차알림
    //버스정보 받기
    var busNum = req.body.busNUM;
    var station = new Array();
    station[0] = req.body.station1;
    station[1] = req.body.station2;
    station[2] = req.body.station3;
    var target_token = req.body.target_token;
    var ord = req.body.ord;
    var alarm = req.body.alarm;
    var index = parseInt(alarm);

    // Registration Token 은 안드로이드 앱에서 나온 Token 입니다.
    var registrationToken = target_token;

    //수정 시작

    var defaultUrl="http://ws.bus.go.kr/api/rest/arrive/getArrInfoByRoute";
    const SERVICE_KEY="a9hQklCDHMmI23KG3suYrx0VtU7OOMgN%2B1SbLmIclORV%2FD%2F5QTRxFtmrjHzv4IEh8GiXMgiryKrlu7KKyAstKg%3D%3D";

    var alarmService = setInterval(function(){

        let url = defaultUrl+"?serviceKey="+SERVICE_KEY+"&stId="+station[index-1]+"&busRouteId="+busNum+"&ord="+ (Number(ord)-index+1);
        console.log(url);
        request(url,
            (err, res, body) => {
                if(body) {
                    var $ = cheerio.load(body);

                    var whereisbus1 = $('arrmsg1').text() + "";

                    if (whereisbus1 == '곧 도착' || whereisbus1.includes("0번째 전")) {
                        var message = {
                            data: {
                                title: $('rtNm').text() + '번 버스가 ' + $('stNm').text() + '에 도착 예정입니다.'
                            },
                            token: registrationToken
                        };

                        admin.messaging().send(message)
                            .then((response) => {
                                console.log('Successfully sent message:', response);
                            })
                            .catch((error) => {
                                console.log('Error sending message:', error);
                            });
                        index = index - 1;
                    }
                    if (index <= 0) {
                        console.log('end');
                        clearInterval(alarmService);
                    }
                } else {
                    console.log("error :: body is null");
                }
        });
    }, 30000);

    res.status(200).json({"result": 1});
};

exports.testPutAPI = (req, res) => {
    //하차알림
    //버스정보 받기
    var busNum = req.body.busNUM;
    var station = new Array();
    station[0] = req.body.station1;
    station[1] = req.body.station2;
    station[2] = req.body.station3;
    var target_token = req.body.target_token;
    var ord = req.body.ord;
    var alarm = req.body.alarm;
    var index = parseInt(alarm);
    var plainNo = req.body.myBus;

    // Registration Token 은 안드로이드 앱에서 나온 Token 입니다.
    var registrationToken = target_token;

    // 수정 시작
    var defaultUrl="http://ws.bus.go.kr/api/rest/arrive/getArrInfoByRoute";
    const SERVICE_KEY="a9hQklCDHMmI23KG3suYrx0VtU7OOMgN%2B1SbLmIclORV%2FD%2F5QTRxFtmrjHzv4IEh8GiXMgiryKrlu7KKyAstKg%3D%3D";

    var alarmService = setInterval(function(){

        let url = defaultUrl+"?serviceKey="+SERVICE_KEY+"&stId="+station[index-1]+"&busRouteId="+busNum+"&ord="+ (Number(ord)-index+1);
        console.log(url);
        request(url,
            function(err, res, body){
            if(body) {
                var $ = cheerio.load(body);

                var whereisbus1 = $('arrmsg1').text() + "";
                var busPlainNum = $('plainNo1').text() + "";

                if (busPlainNum == plainNo) {
                    if (whereisbus1 == '곧 도착' || whereisbus1.includes("0번째 전")) {
                        var message = {
                            data: {
                                title: $('rtNm').text() + '번 버스가 ' + $('stNm').text() + '에 도착 예정입니다.'
                            },
                            token: registrationToken
                        };

                        admin.messaging().send(message)
                            .then((response) => {
                                console.log('Successfully sent message:', response);
                            })
                            .catch((error) => {
                                console.log('Error sending message:', error);
                            });
                        index = index - 1;
                        if ((index) < 0) {
                            clearInterval(alarmService);
                            console.log("끄읏");

                        }
                    }
                }
            } else {
                //
            }
        });
    }, 30000);

    res.status(200).json({"result": 1});
};