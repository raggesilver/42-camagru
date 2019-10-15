const nodemailer  = require('nodemailer');
const pug         = require('pug');
const path        = require('path');
const fs          = require('fs');

function getTransporter() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS
    }
  });
}

module.exports = {
  /**
   *
   * @param {String} templateName name of the template, throws error if not exists
   * @param {Object} mailOptions object containing 'from', 'to' and 'subject'
   * @param {Object} locals object containing vairables for email template
   */
  async sendFromTemplate(templateName, mailOptions, locals = {}) {
    return new Promise((resolve, reject) => {

      try {
        let contentFunction = pug.compileFile(
          path.join(__dirname, 'templates', templateName + '.pug'));

        if (!locals.app_url)
          locals.app_url = process.env.APP_URL;
        let content = contentFunction(locals);

        mailOptions.html = content;
        let transporter = getTransporter();

        transporter.sendMail(mailOptions, (err, info) => {
          if (err) return reject(err);
          return resolve(info);
        });
      }
      catch(e) {
        return reject(e);
      }
    });
  },
};
