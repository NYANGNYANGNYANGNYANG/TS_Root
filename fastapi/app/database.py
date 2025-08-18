# app/database.py

##########################################################################################
#                                       DB Connect                                       #
#                                                                                        #
##########################################################################################  

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
import os

DB_USER = os.getenv("POSTGRES_USER", "TS_user")
DB_PASS = os.getenv("POSTGRES_PASSWORD", "TS_pass")
DB_HOST = os.getenv("POSTGRES_HOST", "postgres")
DB_PORT = os.getenv("POSTGRES_PORT", "5432")
DB_NAME = os.getenv("POSTGRES_DB", "TS_db")

DATABASE_URL = f"postgresql+psycopg2://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

engine = create_engine(DATABASE_URL, pool_pre_ping=True)
# 트랜잭션 단위 DB 세션 생성기
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)

class Base(DeclarativeBase):
    pass

# FastAPI의 Depends에 연결하기 위한 함수
# -> 요청시마다 SessionLocal()
# -> 응답 종료시 finally (세션 종료) --> 메모리 누수 방지
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
