FROM node:18-alpine

WORKDIR /usr/src/app

# Install required dependencies
RUN apk add --no-cache \
    ffmpeg \
    imagemagick \
    imagemagick-webp \
    libwebp \
    git \
    curl \
    bash

COPY package*.json ./
RUN npm install --only=production

COPY . .

EXPOSE 8000

CMD ["npm", "start"]
