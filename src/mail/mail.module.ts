import { MailerModule } from '@nestjs-modules/mailer'; 
import { Global, Module } from '@nestjs/common';
import { MailService } from './mail.service';  
import { OurConfigService } from './config.service';

@Global() // 👈 global module
@Module({
  imports: [
    MailerModule.forRootAsync({
      // imports: [ConfigModule], // import module if not enabled globally
      useFactory: async (config: OurConfigService) => ({
        // transport: config.get("MAIL_TRANSPORT"),
        // or
        transport: {
          host: config.get('MAIL_HOST'),
          secure: false,
          auth: {
            user: config.get('MAIL_USER'),
            pass: config.get('MAIL_PASSWORD'),
          },
        },
        defaults: {
          from: `"No Reply" <${config.get('MAIL_FROM')}>`,
        },
        text: 'Please enter your email address here     and try again.'
      }),
      inject: [OurConfigService],
    }),
  ],
  providers: [MailService,OurConfigService],
  exports: [MailService,OurConfigService],
})
export class MailModule {}
