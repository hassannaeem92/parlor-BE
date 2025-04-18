const nodemailer = require("nodemailer");
const env = require("../global");

module.exports = async (email, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      host: env.EMAIL_HOST,
      service: env.SERVICE,
      port: Number(env.EMAIL_PORT),
      secure: Boolean(env.SECURE),
      auth: {
        user: env.EMAIL,
        pass: env.PASS,
      },
    });

    await transporter.sendMail({
      from: { name: "NobleOil", address: env.EMAIL },
      to: email,
      subject: subject,
      text: text,
    });
    console.log("email sent successfully");
  } catch (error) {
    console.log("email not sent!");
    console.log(error);
    return error;
  }
};
