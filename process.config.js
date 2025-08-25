module.exports = {
  apps: [
    {
      name: "BookBazaar",
      cwd: "./",
      script: "./dist/server.js",
      watch: false,
      instances: 1,
      exec_mode: "cluster",
      env_production: {
        NODE_ENV: "production",
      },
      env_development: {
        NODE_ENV: "development",
      },
    },
  ],
};
