'use strict';
const validator = require('validator');

exports.send = (recipient, message) => {
  // Enable Mailgun if environment variables are present
  if (env.MAILGUN_API_KEY && env.MAILGUN_DOMAIN) {
    const mailgun = require('mailgun-js')({
      apiKey: env.MAILGUN_API_KEY,
      domain: env.MAILGUN_DOMAIN
    });

    return new Promise((resolve, reject) => {
      // Validate the email
      if (!validator.isEmail(recipient)) {
        return reject('Invalid email address');
      }

      // Build the email data
      const data = {
        from: 'CirclesXR <info@circlesxr.com>',
        to: recipient,
        subject: message.subject,
        text: message.text,
        html: message.html,
      };

      // Send through Mailgun
      mailgun.messages().send(data, (error) => {
        if (error) {
          return reject(error);
        }

        return resolve();
      });
    });
  } else {
    console.warn('Mailgun credentials not configured');
    // Return resolved promise for when email's disabled or the settings are
    // missing in a dev environment
    return new Promise((resolve, reject) => resolve());
  }
}
