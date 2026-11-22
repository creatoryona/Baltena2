import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module.js"
import { ensurePortFree } from "./free-port.js"

async function bootstrap() {
  const port = Number(process.env.PORT ?? 4000)
  await ensurePortFree(port)

  const app = await NestFactory.create(AppModule)

  app.enableCors({
    origin: [
      "http://localhost:3000",
      "http://127.0.0.1:3000",
      "http://localhost:3001",
      "http://127.0.0.1:3001",
    ],
    credentials: true,
  })

  await app.listen(port)
  console.log(`Backend is running on http://localhost:${port}`)
}

bootstrap()
