const MAPPER = 'help';

exports.list = (req, res) => {
    global.psql.select(MAPPER, 'selectHelp', null,
        result => res.status(200).json({result}),
        err => {
            res.status(err.status || 500);
            res.render('error');
        }
    );
};