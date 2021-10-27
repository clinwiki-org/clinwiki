import nodemailer from 'nodemailer';
import logger from './util/logger';
import config from '../config';


export function sendEmail(sendTo,subject,body,replyTo) {
    let transport = nodemailer.createTransport({
        host: config.smtpHost,
        port: config.smtpPort,
        auth: {
          user: config.smtpUser,
          pass: config.smtpPassword
        }
      });

      let mailOptions = {
        from: config.outboundEmail,
        to: sendTo,
        subject: subject,
        html: body
      };
      if(replyTo) {
        mailOptions.replyTo = replyTo;
      }
      transport.sendMail(mailOptions, (error,info) => {
        if(error) {
          logger.error(error);
          return;
        }
        logger.info('Email sent to '+sendTo);
      });
}