import { registerAs } from "@nestjs/config";

const resolvePort = () => {
  const configuredPort = Number(process.env.APP_PORT ?? process.env.PORT ?? process.env.API_PORT ?? 4000);

  return Number.isFinite(configuredPort) && configuredPort > 0 ? configuredPort : 4000;
};

export const appConfig = registerAs("app", () => ({
  frontendOrigin: process.env.FRONTEND_ORIGIN ?? "http://localhost:3000",
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: resolvePort(),
}));
