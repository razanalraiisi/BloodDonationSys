# -------- CLIENT DOCKERFILE --------
FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Build production version of React app
RUN npm run build

# Use a simple server to host build
RUN npm install -g serve

EXPOSE 3000
CMD ["serve", "-s", "build", "-l", "3000"]
