

from fastapi import FastAPI

app = FastAPI()

@app.get("/")

def read_root():
    return {"message": "FastAPI + Gunicorn + Uvicorn running on Docker!"}
    

@app.post("/TS")
def create_TS(requester_id: str, ip_address: str):
        enc_id = encrypt(requester_id)
            enc_ip = encrypt(ip_address)
 
    # DB Insert 시 암호화 문자열 저장
    cursor.execute("""INSERT INTO TS (requester_id, ip_address, status, category, access_control_level)
        VALUES (%s, %s, %s, %s, %s)
        """, (enc_id, enc_ip, '미처리', '장애', '관리자'))
    conn.commit()
return {"message": "TS created"}



@app.get("/TS/{TS_id}")
def get_TS(TS_id: int):
    cursor.execute("SELECT requester_id, ip_address FROM TS WHERE TS_id = %s", (TS_id,))
    enc_id, enc_ip = cursor.fetchone()

    # 복호화
    return {
        "requester_id": decrypt(enc_id),
        "ip_address": decrypt(enc_ip)
    }
