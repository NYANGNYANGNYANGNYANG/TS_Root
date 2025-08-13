from Crypto.Cipher import AES
import base64
import os

AES_KEY = os.environ.get("AES_KEY", "12345678901234567890123456789012").encode()
AES_IV = os.environ.get("AES_IV", "1234567890123456").encode()


def pad(text: str) -> str:
    pad_len = 16 - (len(text) % 16)
    return text + chr(pad_len) * pad_len


def unpad(text: str) -> str:
    pad_len = ord(text[-1])
    return text[:-pad_len]


def encrypt(plain_text: str) -> str:
    cipher = AES.new(AES_KEY, AES.MODE_CBC, AES_IV)
    padded_text = pad(plain_text)
    encrypted_bytes = cipher.encrypt(padded_text.encode())
    return base64.b64encode(encrypted_bytes).decode()


def decrypt(encrypted_text: str) -> str;
    cipher = AES.new(AES_KEY, AES.MODE_CBC, AES_IV)
    decoded_bytes = base64.b64decode(encrypted_text)
    decrypted_bytes = cipher.decrypt(decoded_bytes).decode()
    return unpad(decrypted_bytes)
                                                
