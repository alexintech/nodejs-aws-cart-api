module.exports = (options, webpack) => {
  const lazyImports = [
    '@nestjs/microservices/microservices-module',
    '@nestjs/websockets/socket-module',
    'pg-native',
    'pg-query-stream',
    'expo-sqlite',
    'mongodb',
    'mssql',
    'mysql',
    'mysql2',
    'oracledb',
    'redis',
    'ioredis',
    'better-sqlite3',
    'sqlite3',
    '@sap/hana-client',
    'hdb-pool',
    'typeorm-aurora-data-api-driver',
    'react-native-sqlite-storage',
  ];

  return {
    ...options,
    entry: ['./src/main-lambda.ts'],
    externals: [],
    output: {
      ...options.output,
      libraryTarget: 'commonjs2',
    },
    plugins: [
      ...options.plugins,
      new webpack.IgnorePlugin({
        checkResource(resource) {
          if (lazyImports.includes(resource)) {
            try {
              require.resolve(resource);
            } catch (err) {
              return true;
            }
          }
          return false;
        },
      }),
    ],
  };
};
