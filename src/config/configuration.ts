export default () => ({
  port: parseInt(process.env.PORT),
  dbHost: process.env.DB_HOST,
  dbPort: parseInt(process.env.DB_PORT),
  dbUsername: process.env.DB_USERNAME,
  dbPassword: process.env.DB_PASSWORD,
  dbName: process.env.DB_NAME,
  refreshTokenKey: process.env.REFRESH_TOKEN_KEY,
  accessTokenKey: process.env.ACCESS_TOKEN_KEY,
});
