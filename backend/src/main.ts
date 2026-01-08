import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS Ayarı (Frontend bağlanabilsin diye izin veriyoruz)
  app.enableCors();

  // Swagger Ayarları
  const config = new DocumentBuilder()
    .setTitle('Handmade Shop API')
    .setDescription('El yapımı ürünler pazaryeri API dokümantasyonu')
    .setVersion('1.0')
    .addBearerAuth() // Token ile giriş testi için
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // localhost:3000/api adresinde çalışacak

  await app.listen(3000);
}
bootstrap();
