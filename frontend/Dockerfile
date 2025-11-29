# 開發模式 - 直接用你熟悉的 npm start
FROM node:18-alpine

WORKDIR /app

# 複製 package 文件
COPY package*.json ./

# 安裝依賴
RUN npm install

# 複製源代碼
COPY . .

# 暴露端口（React 開發服務器默認端口）
EXPOSE 3000

# 設置環境變數，讓開發服務器可以從外部訪問（Docker 需要這個）
ENV HOST=0.0.0.0

# 啟動開發服務器（就是你本地用的 npm start）
CMD ["npm", "start"]