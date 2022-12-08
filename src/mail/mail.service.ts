import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) { }

  async sendUserConfirmation(user) {


    
    const url = `${user.url}`;
    let html = '<p>Bonjour ' + user.name + '</p><p>Veillez confirmer votre addresse email en cliant sur </p><p><a href="' + url + '">Confirmer</a></p><p>Si vous n\'avez pa été à l\'origine de cette demande , vous pouvez ignorer ce message.</p>';

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


  async sendWelcomeEmail(user) {


 
    const url = `${user.url}`;
    let html = '<p>Bonjour ' + user.name + ',</p><p>  Bienvenu au jeu thé tip top</p><p><a href="' + url + '">Verifier mes ticket maintenant </a></p>';

    try {
      let result = await this.mailerService.sendMail({
        to: user.email,
        from: 'info@dsp-archiwebo21-ct-df-an-cd.fr', // override default from
        subject: 'Bienvenue au jeu de thétiptop. Comment jouer ?',
        html: html, // `.hbs` extension is appended automatically
        // context: { // ✏️ filling curly brackets with content
        //   name: user.name,
        //   url,
        // },
      });



    } catch (error) {


    }



  }


  async sendForgotPasswordVerifier(user) {


    const url = `${user.url}`; 
    let html = '<p>Bonjour ' + user.name + ',</p><p>Veuillez cliquez sur le lien suivant pour confirmer votre demande de changement de mot de passe </p><p><a href="' + url + '">Modifier mon mot de passe</a></p><p></p>';

    try {
      let result = await this.mailerService.sendMail({
        to: user.email,
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
