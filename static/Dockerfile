FROM node:16-alpine3.16 AS builder

WORKDIR /build

# install dependencies
# copy only package.json files for better caching
# (if no dependencies are changed, there is no need to reinstall them, so it is faster to use the cache)
COPY package*.json ./
RUN npm ci
# copy rest of src files etc.
COPY . .

# build and install only production dependencies
RUN npm run build
# install only production dependencies for reducing image size and security (no need for dev dependencies in prod env)
RUN npm ci --only=production


######################################################################

FROM node:16-alpine3.16

WORKDIR /app

MAINTAINER Nico W. <info@ni-wa.de>

EXPOSE 8080

HEALTHCHECK --interval=10s --retries=2 CMD npx docker-healthcheck || exit 1

# copy files from build stage
COPY --from=builder /build/dist/ dist/
COPY --from=builder /build/package*.json ./
COPY --from=builder /build/node_modules/ node_modules/

# [IF WANTED] change user permissions
#RUN chown node:node -R *
# [IF WANTED] switch to node user for more security
#USER node


ENTRYPOINT ["node", "."]
