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
ARG NODE_ENV=dev
ENV NODE_ENV=${NODE_ENV}
EXPOSE 8888
CMD ["npm","run","start:dev"]



