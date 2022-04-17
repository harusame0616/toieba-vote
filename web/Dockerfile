FROM node:17.8.0-buster-slim AS base

USER node
WORKDIR /app/web/project

FROM base AS develop

USER root
# jest --watch モードでgitが必要
RUN apt-get update -qq && apt-get install -qqy git && apt-get clean && rm -rf /var/lib/apt/lists/*
USER node

CMD ["npm", "run", "dev"]
