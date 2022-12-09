import { UrlGeneratorModuleOptions } from 'nestjs-url-generator';

export function urlGeneratorModuleConfig(): UrlGeneratorModuleOptions {
  return {
    secret: "66C5C66A5B3E51AF919E8BD7ED4AC1C4CB28A7455F9D269E1A5CAB7C5B", // optional, required only for signed URL
    appUrl: "https://api.dev.dsp-archiwebo21-ct-df-an-cd.fr"
  };
}