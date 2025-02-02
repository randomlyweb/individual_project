import hashlib
import ecdsa
import difflib

from .models import Block


def hash_file(file):
    sha256 = hashlib.sha256()
    for chunk in file.chunks():
        sha256.update(chunk)
    return sha256.hexdigest()


def is_duplicate(file_hash):
    hashes = Block.objects.values_list('file_hash', flat=True)
    for existing_hash in hashes:
        similarity = difflib.SequenceMatcher(None, existing_hash, file_hash).ratio()
        if similarity >= 0.98:
            return True
    return False


def generate_keys():
    sk = ecdsa.SigningKey.generate(curve=ecdsa.SECP256k1)
    vk = sk.verifying_key
    return sk, vk


def sign_data(sk, data):
    return sk.sign(data.encode()).hex()