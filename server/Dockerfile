FROM node:19-bullseye

WORKDIR /app

# Copy all files except for those listed in .dockerignore (like node_modules)
COPY . .

RUN npm install

CMD bash -c 'while !</dev/tcp/db/5432; do sleep 1; done; npm run dev'