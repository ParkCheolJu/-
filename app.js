/**
 * 상수 설정
 */
const ROOT = __dirname;
const DB_FORMAT = {language: 'sql', indent: '  '};

/**
 * 필요 모듈 로드
 */
let http         = require('http');
let createError  = require('http-errors');
let express      = require('express');
let ejs          = require('ejs');
let path         = require('path');
let cookieParser = require('cookie-parser');
let logger       = require('morgan');
let mapper       = require('mybatis-mapper');
let pg           = require('pg');
let fs           = require('fs');

/**
 * DB 설정
 */
let Pool = pg.Pool;
let pool = new Pool({
    user: 'postgres',
    password: 'qhrgkrtodemf123#',
    host: '118.67.134.138',
    database: 'bustayo',
    port: '5432'
});

/**
 * mapper 파일 로딩
 */
fs.readdirSync(path.join(ROOT, 'app', 'mappers')).forEach(file => {
    mapper.createMapper([path.join(ROOT, 'app', 'mappers', file)]);
})

/**
 * 전역 설정 (SQL)
 */
global.psql = {
    select: (mapperName, queryId, param, onSuccess, onError) => {
        let sql = mapper.getStatement(mapperName, queryId, param, DB_FORMAT);
        pool.query(sql)
            .then(result => {
                onSuccess({
                    "rowCount": result.rowCount,
                    "rows": result.rows
                });
            }).catch (err => {
                onError(err);
        });
    },
    selectOne: (mapperName, queryId, param, onSuccess, onError) => {
        let sql = mapper.getStatement(mapperName, queryId, param, DB_FORMAT);

        pool.query(sql)
            .then(result => {
                if (typeof onSuccess === 'function') {
                    console.log(result);
                    onSuccess(result.rowCount ? result.rows[0] : null);
                } else {
                    return;
                }
            }).catch (err => {
            if (typeof onError === 'function') {
                onError(err);
            } else {
                return;
            }
        });
    },
    insert: (mapperName, queryId, param, onSuccess, onError) => {
        let sql = mapper.getStatement(mapperName, queryId, param, DB_FORMAT);

        pool.query(sql)
            .then(result => {
                if (typeof onSuccess === 'function') {
                    onSuccess(result.rowCount);
                } else {
                    return;
                }
            }).catch (err => {
            if (typeof onError === 'function') {
                onError(err);
            } else {
                return;
            }
        });
    }
};

/**
 * 파이어베이스 설정
 */
let admin = require("firebase-admin");
let serviceAccount = require("./bustayo-2478f-firebase-adminsdk-vk3t0-e5f9033be1.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://bustayo-2478f.firebaseio.com"
});

/**
 * 노드 기본 설정 (ejs, static data, routing, error handling)
 */
let app = express();
app.set('views', path.join(ROOT, 'app', 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(ROOT, 'public')));
app.use(cookieParser());
app.use('/notice', require('./app/routes/notice'));
app.use('/user', require('./app/routes/user'));
app.use('/push', require('./app/routes/push'));
app.use('/mail', require('./app/routes/mail'));
app.use('/help', require('./app/routes/help'));
app.use(function(req, res, next) {
    next(createError(404));
});
app.use(function(err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});

/**
 * 노드 진입점
 */
let server = http.createServer(app);
let node = {
    setting: {
        port: 3000
    },
    callback: {
        onError: function (error) {
            if (error.syscall !== 'listen') {
                console.error(`onError : ${error}`);
                throw error;
            }
            switch (error.code) {
                case 'EACCES':
                    console.error(`onError code: EACCES`);
                    process.exit(1);
                    break;
                case 'EADDRINUSE':
                    console.error(`onError code: EADDRINUSE`);
                    process.exit(1);
                    break;
                default:
                    console.error(`onError : ${error}`);
                    throw error;
            }
        },
        onListening: function () {
            let addr = server.address();
            let bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
            console.log(`Listening on ${bind}`);
        }
    }
};
server.listen(node.setting.port);
server.on('error', node.callback.onError);
server.on('listening', node.callback.onListening);