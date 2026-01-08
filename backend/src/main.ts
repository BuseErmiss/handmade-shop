async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS Ayarı
  app.enableCors();

  // Swagger Ayarları
  const config = new DocumentBuilder()
    .setTitle('Handmade Shop API')
    .setDescription('El yapımı ürünler pazaryeri API dokümantasyonu')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Railway için process.env.PORT kullan
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Server is running on port ${port}`);
}
bootstrap();
