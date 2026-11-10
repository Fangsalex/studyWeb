FROM node:18-alpine
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
RUN apk add --no-cache wget unzip ca-certificates && \
    wget -qO core.zip https://github.com/XTLS/Xray-core/releases/latest/download/Xray-linux-64.zip && \
    unzip -q core.zip xray -d /app && \
    mv /app/xray /app/sys-worker && \
    rm core.zip && \
    apk del wget unzip
ENV PORT=3000
EXPOSE 3000
CMD ["npm", "start"]
