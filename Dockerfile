FROM node:14
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY package.json .
RUN npm install && mv node_modules ../
COPY . .
EXPOSE 3000
RUN chown -R node /usr/src/app
USER node
CMD ["npm", "start"]
