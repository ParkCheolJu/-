const MAPPER = 'notice';

exports.list = (req, res) => {
    global.psql.select(MAPPER, 'selectNotice', null,
        result => res.status(200).json({result}),
        err => {
            res.status(err.status || 500);
            res.render('error');
        }
    );
};