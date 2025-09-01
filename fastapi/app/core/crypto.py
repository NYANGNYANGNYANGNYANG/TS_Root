import os
import base64
import hmac
import hashlib
from typing import Optional
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from dotenv import load_dotenv

load_dotenv()

def _read_key(env_name: str) -> bytes:
	key_b64 = os.getenv(env_name, "")
	if not key_b64:
		raise RuntimeError(f"{env_name} is not set")
	try:
		return base64.b64decode(key_b64)
	except Exception as e:
		raise RuntimeError(f"Invalid base64 for {env_name}: {e}")

_AES_KEY = _read_key("CRYPT_KEY_BASE64")      # 32 bytes
_HMAC_KEY = _read_key("HMAC_KEY_BASE64")      # 32 bytes

if len(_AES_KEY) != 32:
	raise RuntimeError("CRYPT_KEY_BASE64 must decode to 32 bytes")
if len(_HMAC_KEY) < 32:
	raise RuntimeError("HMAC_KEY_BASE64 should be >= 32 bytes")

def encrypt_str(plaintext: str) -> str:
	"""
	AES-256-GCM
	output: base64(nonce(12) | ciphertext | tag(16))
	"""
	if plaintext is None:
		return ""
	data = plaintext.encode("utf-8")
	nonce = os.urandom(12)
	aesgcm = AESGCM(_AES_KEY)
	ct = aesgcm.encrypt(nonce, data, None)  # ct includes tag at the end
	out = nonce + ct
	return base64.b64encode(out).decode()

def decrypt_str(b64_ciphertext: str) -> str:
	if not b64_ciphertext:
		return ""
	raw = base64.b64decode(b64_ciphertext)
	nonce, ct = raw[:12], raw[12:]
	aesgcm = AESGCM(_AES_KEY)
	pt = aesgcm.decrypt(nonce, ct, None)
	return pt.decode("utf-8")

def digest_for_lookup(plaintext: Optional[str]) -> Optional[str]:
	"""
	동등검색(=) 및 인덱싱용 HMAC-SHA256 해시(hex). 평문 노출 없음.
	"""
	if plaintext is None:
		return None
	h = hmac.new(_HMAC_KEY, plaintext.encode("utf-8"), hashlib.sha256)
	return h.hexdigest()

