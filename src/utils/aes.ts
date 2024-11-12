import CryptoJS from 'crypto-js'
import { cacheCipher, aes } from '@/libs/config'

/**
 * aes 加密，解密
 * */
export const Aes = {
  // 加密CBC模式
  encrypt (word: string) {
    const key = CryptoJS.enc.Utf8.parse(cacheCipher.key)
    const iv = CryptoJS.enc.Utf8.parse(cacheCipher.iv)
    const src = CryptoJS.enc.Utf8.parse(word)
    const encrypted = CryptoJS.AES.encrypt(src, key, {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    })
    return aes + encrypted.toString()
  },
  // 解密CBC模式
  decrypt (word:string) {
    const key = CryptoJS.enc.Utf8.parse(cacheCipher.key)
    const iv = CryptoJS.enc.Utf8.parse(cacheCipher.iv)
    const decrypt = CryptoJS.AES.decrypt(word, key, {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    })
    return decrypt.toString(CryptoJS.enc.Utf8)
  }
}
