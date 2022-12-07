import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) { }

  async sendUserConfirmation(user) {


    console.log('Hello cheikh', user)
    const url = `https://api.dev.dsp-archiwebo21-ct-df-an-cd.fr/user/verify-email?verification=${user.verification}`;
    let html = '<p>Hey ' + user.name + ',</p><p>Please click below to confirm your email</p><p><a href="' + url + '">Confirm</a></p><p>If you did not request this email you can safely ignore it.</p>';

    try {
      let result = await this.mailerService.sendMail({
        to: user.email,
        from: 'info@dsp-archiwebo21-ct-df-an-cd.fr', // override default from
        subject: 'Bienvenue au jeu de thétiptop. Confirmer votre email',
        html: html, // `.hbs` extension is appended automatically
        // context: { // ✏️ filling curly brackets with content
        //   name: user.name,
        //   url,
        // },
      });

      
      
    } catch (error) {
      

    }



  }


  async sendForgotPasswordVerifier(forgotPassword) {


    console.log('Hello cheikh', forgotPassword)
    const url = `https://api.dev.dsp-archiwebo21-ct-df-an-cd.fr/user/forgot-password-verify?verification=${forgotPassword.verification}`;
    let html = '<p>Bonjour ' + forgotPassword.name + ',</p><p>Veuillez cliquez sur le lien suivant pour confirmer votre demande de changement de mot de passe </p><p><a href="' + url + '">Modifier mon mot de passe</a></p><p></p>';

    try {
      let result = await this.mailerService.sendMail({
        to: forgotPassword.email,
        from: 'info@dsp-archiwebo21-ct-df-an-cd.fr', // override default from
        subject: 'Demande de changement de mot de passe',
        html: html, // `.hbs` extension is appended automatically
        // context: { // ✏️ filling curly brackets with content
        //   name: user.name,
        //   url,
        // },
      });

      
      
    } catch (error) {
      

    }



  }
}
