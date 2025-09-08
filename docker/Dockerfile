FROM node:21.6.0-bullseye-slim AS base

LABEL maintainer="Ahmedul Haque Abid <a_h_abid@hotmail.com>"

ARG HTTP_PROXY="http://10.10.20.107:3828"
ARG HTTPS_PROXY="http://10.10.20.107:3828"
ARG NO_PROXY="localhost,127.0.0.1"
ARG TIMEZONE="Asia/Dhaka"

ENV http_proxy="${HTTP_PROXY}" \
    https_proxy="${HTTPS_PROXY}" \
    no_proxy="${NO_PROXY}" \
    TZ="${TIMEZONE}"

USER root

USER root

# Always install curl and other basic packages
RUN apt update \
    && apt install -y curl libssl-dev procps telnet tzdata ca-certificates \
    && apt clean \
    && apt autoremove -y \
    && rm -rf /var/lib/apt/lists/*

ARG UID="1000"
ARG GID="1000"

RUN userdel -r node \
    && groupadd --gid ${GID} appuser \
    && useradd --uid ${UID} --create-home --system --comment "AppUser" --shell /bin/bash --gid appuser appuser \
    && mkdir -p /home/appuser/appsrc \
    && chown -R appuser:appuser /home/appuser/appsrc

WORKDIR /home/appuser/appsrc

COPY --chown=appuser:appuser ./codes/package.json ./codes/package-lock*.json ./

USER appuser

######################################################

FROM base AS dev

USER root

RUN apt-get update \
    && apt-get install -y curl libssl-dev procps telnet ca-certificates \
    && rm -rf /var/lib/apt/lists/*

USER appuser

RUN echo "-- Install Local NPM Packages --" \
    && (npm ci --ignore-scripts --no-audit || npm install --ignore-scripts --no-audit)

COPY --chown=appuser:appuser ./codes/ ./

STOPSIGNAL SIGTERM

CMD [ "node", "node_modules/.bin/nest", "start", "--watch" ]

######################################################

FROM dev AS builder

USER root

ARG SHOULD_RUN_CHOWN_TO_APPUSER="true"

RUN if [ "${SHOULD_RUN_CHOWN_TO_APPUSER}" = "true" ]; then \
    chown -R appuser:appuser . \
    ;fi

USER appuser

RUN npx prisma generate --schema=./src/database/prisma/schema.prisma \
    && npm run build \
    && npm ci --omit=dev \
    && npx prisma generate --schema=./src/database/prisma/schema.prisma

######################################################

FROM base AS prod

COPY --chown=appuser:appuser --from=builder /home/appuser/appsrc/node_modules ./node_modules
COPY --chown=appuser:appuser --from=builder /home/appuser/appsrc/dist ./dist
COPY --chown=appuser:appuser --from=builder /home/appuser/appsrc/package.json /home/appuser/appsrc/package-lock.json ./

# Unset ENVs
ENV http_proxy="" \
    https_proxy="" \
    no_proxy=""

STOPSIGNAL SIGTERM

CMD [ "node", "dist/main" ]
