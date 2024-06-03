const mailRouter = require("express").Router();
var nodemailer = require("nodemailer");
const sendEmail = require("../utils/sendMail");


mailRouter.post("/mail/contact", async (req, res) => {
    try {
      // var transporter = nodemailer.createTransport({
      //   service: "gmail",
      //   auth: {
      //     user: "mostafamabdallah94@gmail.com",
      //     pass: "piutjcingwgnxhsv",
      //   },
      // });
  
      var mailOptions = {
        // from: req.body.data.email,
        to: req.body.data.email,
        subject: req.body.data.subject,
        html: `<body>
        <div style="padding: 30px;">
            <div style="display: flex;">
                <div style="width: 50%;">From</div>
                <div style="width: 50%;">${req.body.data.firstName}</div>
            </div>
            <div style="display: flex;">
                <div style="width: 50%;">Phone</div>
                <div style="width: 50%;">${req.body.data.phone}</div>
            </div>
            <div style="display: flex;">
                <div style="width: 50%;">Subject ${req.body.data.email}</div>
                <div style="width: 50%;">${req.body.data.subject}</div>
            </div>
            <div style="display: flex;">
                <div style="width: 50%;">Messeage</div>
                <div style="width: 50%;">${req.body.data.message}</div>
            </div>
        </div>
    </body>`,
      };
  
      await sendEmail(mailOptions, function (error, info) {
        if (error) {
          return res.send(error)
        } else {
          return res.send('true')
        }
      });
    } catch (er) {
        console.log(er)
        res.status(500).send(er.message)
     }
  })


module.exports = mailRouter;
