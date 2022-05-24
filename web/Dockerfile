FROM node:17.8.0-buster-slim AS base

WORKDIR /app/web/project
RUN chown node:node .
USER node

FROM base AS develop

USER root
# 次のメッセージを表示させないようにする: debconf: delaying package configuration, since apt-utils is not installed
ENV DEBCONF_NOWARNINGS=yes
# jest --watch モードでgitが必要
RUN apt-get update -qq && apt-get install -qqy git && apt-get clean && rm -rf /var/lib/apt/lists/*

CMD ["npm", "run", "dev"]

FROM base AS build
COPY --chown=node:node ./project/package*.json ./
RUN npm i

COPY --chown=node:node ./project/ ./
RUN npm run build

FROM build as production
COPY --chown=node:node --from=build /app/web/project/.next/ ./
COPY --chown=node:node --from=build /app/web/project/ ./
COPY --chown=node:node --from=build /app/web/project/next.config.js ./
COPY --chown=node:node --from=build /app/web/project/package.json ./
CMD ["npm", "start"]
