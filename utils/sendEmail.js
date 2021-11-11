import nodemailer from "nodemailer";
import SMTPModel  from "../model/emailSettingModel.js";
import smtpTransport  from "nodemailer-smtp-transport";

const sendEmail = async (options) => {
 
  const emailsettings = await SMTPModel.findOne();
  // let host = emailsettings.host;
  // let user = emailsettings.username;
  // let pass = emailsettings.password;

  let host = 'gmail';
  let user = 'ram.gautam@digimonk.in';
  let pass = 'Digimonk#123';

  var transporter = nodemailer.createTransport(
    smtpTransport({
      service: 'gmail',
      // host: host,
      // tls: { rejectUnauthorized: true },
      // secureConnection: true,
      // port: 465,
      auth: {
        user: user,
        pass: pass,
      },
    })
  );

  //2 define email options
  const mailOptions = {
    from: `Wishfy ${user}`,
    to: options.email,
    subject: options.subject,
    html: options.message,
  };
  //3 Actually send the email

  await transporter.sendMail(mailOptions);
};

export default sendEmail;
