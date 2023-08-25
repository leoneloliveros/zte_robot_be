FROM node:17.4.0

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma

RUN npm install
RUN npm run postinstall
RUN npm run seed

COPY . .

EXPOSE 8080

CMD ["node", "src/app.js"]