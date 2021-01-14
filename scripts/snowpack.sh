SOURCE=${1:-remote}

cat <<EOT > .gitignore
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
    @github/time-elements \
    @primer/octicons \
    @urql/exchange-graphcache \
    @urql/introspection \
    @urql/preact \
    date-fns \
    graphql \
    htm \
    marked \
    preact-router \
    preact \
    urql

yarn snowpack dev

# Issues:
#
#  * npx live-server --port=1337 --entry-file=404.html
#      doesnt work
#
#  * https://cdn.skypack.dev/es-module-shims
#      doesnt work