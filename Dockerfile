FROM node:18-alpine

WORKDIR /app

# Copie des fichiers de dépendances
COPY package*.json ./
RUN npm install

# Copie du reste du code source
COPY . .

# Exposition du port Vite
EXPOSE 5173

# Lancement du serveur de dev React/Vite (accessible depuis l'extérieur du conteneur avec --host)
CMD ["npm", "run", "dev", "--", "--host"]