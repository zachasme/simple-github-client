SOURCE=${1:-remote}

cat <<EOT > .gitignore
.env
build
.snowpack
node_modules
package.json
snowpack.config.js
EOT

cat <<EOT > snowpack.config.js
module.exports = {
  routes: [
    {"match": "routes", "src": ".*", "dest": "/404.html"},
  ],
  packageOptions: { source: '${SOURCE}' }
}
EOT

yarn add snowpack \
    @primer/octicons-react \
    @urql/core \
    @urql/exchange-auth \
    @urql/exchange-graphcache \
    @urql/exchange-request-policy \
    @urql/introspection \
    date-fns \
    graphql \
    htm \
    marked \
    react \
    react-dom \
    react-router-dom \
    redbox-react \
    urql

yarn snowpack dev

# Issues:
#
#  * npx live-server --port=1337 --entry-file=404.html
#      doesnt work
#
#  * https://cdn.skypack.dev/es-module-shims
#      doesnt work