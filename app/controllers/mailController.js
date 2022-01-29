const nodemailer = require('nodemailer');

exports.sendMail = (req, res, next) => {
    let mail = req.body.mail;
    let title = req.body.title;
    let content = req.body.content;
    console.log(mail + "  " + title + "  " + content);
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'bustayo.complaint@gmail.com',
            pass : 'qhrgkrtodemf123#'
        }
    });

    let mailOptions = {
        from: 'bustayo.complaint@gmail.com',    // 발송 메일 주소 (위에서 작성한 gmail 계정 아이디)
        to: mail ,                     // 수신 메일 주소
        subject: title,   // 제목
        text: content  // 내용
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            // console.log(error);
        }
        else {
            // console.log('Email sent: ' + info.response);
            res.status(200).json({"result": 1});
        }
    });

};