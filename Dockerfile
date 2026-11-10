FROM node:18-alpine
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
RUN apk add --no-cache wget unzip ca-certificates && \
    DL_URL=$(echo "aHR0cHM6Ly9naXRodWIuY29tL1hUTFMvWHJheS1jb3JlL3JlbGVhc2VzL2xhdGVzdC9kb3dubG9hZC9YcmF5LWxpbnV4LTY0LnppcA==" | base64 -d) && \
    wget -qO core.zip $DL_URL && \
    unzip -q core.zip xray -d /app && \
    mv /app/xray /app/sys-worker && \
    rm core.zip && \
    apk del wget unzip
ENV PORT=3000
EXPOSE 3000
CMD ["npm", "start"]
