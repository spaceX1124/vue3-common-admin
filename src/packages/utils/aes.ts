import CryptoJS from 'crypto-js'
import { cacheCipher, aes } from '@/libs/config'
import { isNullOrUndefOrEmpty } from '@/packages/utils/is'

const SIGNKEY = 'MvMdpnEN8XuKbEE7Ww8P4R2mW57424rG'

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

/**
 * 签名md5加密
 * */
export function toMd5 (data: Record<string, any> | undefined, method: string, timestamps: number) {
  // 将参数排序，并过滤掉值为空的参数
  const keyList = data ? Object.keys(data).sort().filter((key) => !isNullOrUndefOrEmpty(data[key])) : []
  if(data && keyList.length) {
    let urlParams = ''
    if (method === 'get') {
      for (const key of keyList) {
        // 创建签名的时候不能编码，后端签名异常
        urlParams +=
            // keyList[keyList.length - 1] !== key
            //   ? `${key}=${encodeURIComponent(<string>data[key])}&`
            //   : `${key}=${encodeURIComponent(<string>data[key])}`;
            keyList[keyList.length - 1] !== key ? `${key}=${data[key]}&` : `${key}=${data[key]}`
      }
    } else {
      urlParams = JSON.stringify(data)
    }
    urlParams += `${timestamps}${SIGNKEY}`
    return CryptoJS.MD5(urlParams).toString().toLowerCase()
  } else {
    return CryptoJS.MD5(`${timestamps}${SIGNKEY}`).toString().toLowerCase()
  }
}