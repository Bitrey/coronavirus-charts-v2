module.exports = {
    apps: [
        {
            name: "Coronavirus Charts V2",
            script: "node",
            args: "build/index.js",
            instances: 1,
            autorestart: true,
            watch: false,
            max_memory_restart: "1G",
            env: {
                NODE_ENV: "development",
                IP: "127.0.0.1",
                PORT: "3000",
                INLINE_RUNTIME_CHUNK: false
            },
            env_production: {
                NODE_ENV: "production",
                IP: "127.0.0.1",
                PORT: "3000",
                INLINE_RUNTIME_CHUNK: false
            }
        }
    ]
    /*
  deploy : {
    production : {
      user : 'node',
      host : '212.83.163.1',
      ref  : 'origin/master',
      repo : 'git@github.com:repo.git',
      path : '/var/www/production',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production'
    }
  }
  */
};
