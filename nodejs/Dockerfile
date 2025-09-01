# nodejs/Dockerfile (단일 스테이지 최소 수정)

FROM node:18-alpine
WORKDIR /app

# 1) 의존성
COPY package.json package-lock.json ./
RUN npm ci

# 2) 설정 파일을 빌드 전에 명시적으로 복사
COPY postcss.config.mjs tailwind.config.js ./
COPY tsconfig.json next.config.ts ./
# 필요 시 next.config.ts 등도
# COPY next.config.ts ./

# 3) 소스
COPY src ./src
COPY public ./public

# 4) 빌드
ENV NODE_ENV=production
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]

