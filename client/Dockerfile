FROM node:19-bullseye

WORKDIR /app

COPY . .

RUN npm install --legacy-peer-deps

# Expose port 5173 for the frontend
EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]