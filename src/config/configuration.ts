export default () => ({
  //Port server
  port: parseInt(process.env.PORT),
  //Database connection
  dbHost: process.env.DB_HOST,
  dbPort: parseInt(process.env.DB_PORT),
  dbUsername: process.env.DB_USERNAME,
  dbPassword: process.env.DB_PASSWORD,
  dbName: process.env.DB_NAME,
  //JWT service key
  refreshTokenKey: process.env.REFRESH_TOKEN_KEY,
  accessTokenKey: process.env.ACCESS_TOKEN_KEY,
  //Cloudinary connection
  cloudinaryName: process.env.CLOUDINARY_NAME,
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
  //Mail connection
  mailHost: process.env.MAIL_HOST,
  mailPort: process.env.MAIL_PORT,
  mailUser: process.env.MAIL_USER,
  mailPassword: process.env.MAIL_PASSWORD,
  defaultMailFrom: process.env.DEFAULT_MAIL_FROM,
  //Redis connection
  redisHost: process.env.REDIS_HOST,
  redisPort: process.env.REDIS_PORT,
  //Elastic connection
  elasticNode: process.env.ELASTICSEARCH_NODE,
});
