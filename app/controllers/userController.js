const MAPPER = 'user';

/* 전체 리스트 출력 */
exports.list = (req, res) => {
    global.psql.select(MAPPER, 'selectUser', null,
        result => res.status(200).json({result}),
        err => {
            res.status(err.status || 500);
            res.render('error');
        }
    );
};

/* 아이디 검색 (중복확인) */
exports.getId = (req, res) => {
    let param = {"id": req.query.id };

    global.psql.select(MAPPER, 'selectId', param,
        result => res.status(200).json({result}),
        err => {
            res.status(err.status || 500);
            res.render('error');
        }
    );
};

/* 로그인 정보 검색 (로그인) */
exports.getLoginInfo = (req, res) => {
    let param = {"id": req.query.id, "pw": req.query.pw };

    global.psql.select(MAPPER, 'selectLoginInfo', param,
        result => res.status(200).json({result}),
        err => {
            res.status(err.status || 500);
            res.render('error');
        }
    );
};

/* DB에 정보 저장 (회원가입) */
exports.joinIn = (req, res) => {
    let param = {"id": req.query.id,
                 "pw": req.query.pw,
                 "name": req.query.name,
                 "birthdate": req.query.birthdate == undefined? null:req.query.birthdate,
                 "tel": req.query.tel == undefined? null:req.query.tel,
                 "gender": req.query.gender == undefined? null:req.query.gender,
                 "email": req.query.email == undefined? null:req.query.email };

    console.log(param);

    global.psql.insert(MAPPER, 'insertUserData', param,
        result => res.status(200).json({result}),
        err => {
            res.status(err.status || 500);
            res.render('error');
        }
    );
};