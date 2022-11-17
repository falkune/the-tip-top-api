import { ConsoleLogger } from '@nestjs/common';

export class LoggerService extends ConsoleLogger {

 
  error(message: any, stack?: string, context?: string) {
   //dd
  }
}