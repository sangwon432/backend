FROM node:18

WORKDIR /backend

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

CMD [ "npm", "run", "start:dev" ]


####################
## BUILD FOR LOCAL DEVELOPMENT
####################
#
#FROM node:18-alpine As Development
#
#WORKDIR /usr/src/app
#
#COPY --chown=node:node package*.json ./
#
#RUN npm install --force
#
#COPY --chown=node:node . .
#
#USER node
#
####################
## BUILD FOR LOCAL PRODUCTION
####################
#
#FROM node:18-alpine As build
#
#WORKDIR /usr/src/app
#
#COPY --chown=node:node package*.json ./
#
#COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules
#
#COPY --chown=node:node . .
#
#RUN npm run build
#
#ENV NODE_ENV production
#
#RUN npm ci -only=production && npm cache clean -force
#
#USER node
#
