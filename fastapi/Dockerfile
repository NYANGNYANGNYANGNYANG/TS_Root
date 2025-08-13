

FROM python:3.12-slim


# 컨테이너 내 작업 디렉토리
WORKDIR /app


# 의존성 파일 복사 및 설치
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt


# 소스코드 복사
COPY app ./app
COPY run.sh ./run.sh
RUN chmod +x ./run.sh

# gunicorn 실행 명령어 (uvicorn worker)
CMD ["sh", "./run.sh"]


