# Install packages and build source code -> dist
FROM node:12 AS builder 
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build


# Run production
FROM node:12-slim 
WORKDIR /app
COPY --from=builder /app .
# Get port from source
ARG NODE_ENV=local
ENV NODE_ENV=${NODE_ENV}
ENV TYPEORM_DATABASE_HOST = ${curl ifconfig.me}
EXPOSE 8888
CMD ["npm","run","start:prod"]



