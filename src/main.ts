/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { urlencoded } from 'express';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  // const hostDomain = AppModule.isDev ? `${AppModule.host}:${AppModule.port}` : `${AppModule.host}`;
  const logger = new Logger('bootstrap');
  const app = await NestFactory.create(AppModule);
  app.use(urlencoded({ extended: true }));
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.enableShutdownHooks();
  app.useGlobalPipes(new ValidationPipe());

  const swaggerOptions = new DocumentBuilder()
    .setTitle('Core')
    .setDescription('API Documentation')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerOptions);

  app.use('/api/docs/swagger.json', (req, res) => {
    res.send(swaggerDocument);
  });

  const port = process.env.APP_PORT;
  let url = `http://localhost:${port}/api/docs/`;

  const env =  process.env.NODE_ENV;
  if (env === 'prod') {
    url = `http://${process.env.SERVER_HOST}:${process.env.SERVER_PORT}/api/docs/`;
  }

  SwaggerModule.setup('/api/docs', app, null, {
    swaggerUrl: `${url}swagger.json`,
    explorer: true,
    swaggerOptions: {
      docExpansion: 'list',
      filter: true,
      showRequestDuration: true,
    },
  });

  app.enableShutdownHooks();

  const server = await app.listen(port);

  logger.log(`Application listening on port ${port}`);
  logger.log(`URL: ${url}`);
  logger.log(`Environment : ${env}`);

  server.setTimeout(180000);
}
bootstrap();
