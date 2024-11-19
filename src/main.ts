import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';

async function start() {
  const port = process.env.PORT || 5000;
  const app = await NestFactory.create(AppModule);

  app.use('/webhook', bodyParser.raw({ type: 'application/json' }));

  const config = new DocumentBuilder()
    .setTitle('Магазин товаров SHOPPY')
    .setDescription('Документация REST API')
    .setVersion('1.0.0')
    .addTag('NEST SHOP')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/docs', app, document);

  await app.listen(port, () => console.log(`Server started on port = ${port}`));
}
start();
