cat <<EOT > .gitignore
build
.snowpack
node_modules
package.json
EOT

cat <<EOT > snowpack.config.js
module.exports = {
  routes: [
    {"match": "routes", "src": ".*", "dest": "/404.html"},
  ],
  packageOptions: { source: 'local' }
}
EOT

yarn add snowpack \
    @github/time-elements \
    @primer/octicons \
    @urql/exchange-graphcache \
    @urql/preact \
    date-fns \
    graphql-tag \
    graphql \
    htm \
    marked \
    preact-router \
    preact \
    urql
yarn snowpack dev