FROM node:18-alpine

WORKDIR /app

# 複製 package 文件
COPY package*.json ./

# 安裝生產依賴
RUN npm ci --only=production

# 複製應用代碼
COPY . .

# 暴露端口
EXPOSE 5000

# 啟動應用
CMD ["node", "index.js"]