FROM node:17.8.0-buster-slim AS base

USER node
WORKDIR /app/

FROM base AS develop

CMD ["npm", "run", "dev"]
