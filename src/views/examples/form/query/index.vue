<template>
  <div class="main">
    <div>
      <el-input class="input" v-model="userPhone" maxlength="11"/>
      <el-button type="success" size="small" @click="copy(userPhone)">复制手机号</el-button>
    </div>

    <el-button class="btn"
               @click="zk"
               v-loading.fullscreen.lock="fullscreenLoading"
               type="primary"
    >撞库</el-button
    >

    <p @click="copy(channelUrl)">{{ channelUrl }}</p>
    <p @click="copy(channelToken)">{{ channelToken }}</p>
    <p @click="copy(localUrl)">{{ localUrl }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import CryptoJS from 'crypto-js'
import axios from 'axios'
import useClipboard from 'vue-clipboard3'
import { ElMessage } from 'element-plus'

const fullscreenLoading = ref(false)
const userPhone = ref('')
const channelCode = ref('20')
const channelUrl = ref('')
const channelToken = ref('')
const localUrl = ref('')

userPhone.value = '121' + Math.random().toString(10).slice(-8)

// 加密密钥
const key = CryptoJS.enc.Utf8.parse('Iaz9OFhoJGk0K6AB') // 需确保密钥长度为16字节(渠道配置的加解密钥)

/* 撞库 */
const zk = () => {
  fullscreenLoading.value = true

  const md5_userPhone = CryptoJS.MD5(userPhone.value).toString().toUpperCase()
  const data = { userPhone: md5_userPhone, channelCode: channelCode.value }

  // AES加密（ECB模式，PKCS7填充，输出Base64）
  const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(data), key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  }).toString()
  const enc_body = { channelCode: channelCode.value, data: encryptedData }
  axios
  .post(
          `https://test-gw.daokb.com/open/channel/filter/bjtHalfMd5/${channelCode.value}`,
          enc_body
  )
  .then((res) => {
    console.log(res)
    if (res?.data?.code === 0) jj()
  })
  .finally(() => {
    fullscreenLoading.value = false
  })
}

/* 进件 */
const jj = () => {
  const data = {
    age: 26,
    sex: 0,
    car: 2,
    creditCard: 2,
    gjj: 3,
    house: 2,
    sesame: 3,
    socialInsurance: 3,
    insurancePolicy: 4,
    loanAmount: 5,
    loanTerm: 3,
    monthlyIncome: 4,
    payType: 1,
    profession: 5,
    qualification: 5,
    creditInformation: 2,
    workAge: 3,
    idCard: '445281199004041827',
    name: '许惠璇',
    city: '成都市',
    channelCode: channelCode.value,
    userPhone: userPhone.value
  }
  // AES加密（ECB模式，PKCS7填充，输出Base64）
  const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(data), key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  }).toString()
  const enc_body = { channelCode: channelCode.value, data: encryptedData } // 加密后的请求参数

  axios
  .post(
          `https://test-gw.daokb.com/open/channel/input/bjtHalfMd5/${channelCode.value}`,
          enc_body
  )
  .then((res) => {
    channelUrl.value = res.data.data
    if (channelUrl.value) {
      channelToken.value = res.data.data.split('token=')[1]
      localUrl.value = 'http://192.168.0.75:5230/loginThree?token=' + channelToken.value
    }
  })
}

const copy = async (msg: string) => {
  console.log(msg, 'copy')
  const { toClipboard } = useClipboard()
  try {
    await toClipboard(msg)
    ElMessage.success('复制成功！')
  } catch (e) {
    ElMessage.error('复制失败，请稍后重试')
    console.log(e, '复制失败')
  }
}
</script>

<style scoped lang="scss">
.main {
  padding: 20px;
  display: flex;
  flex-flow: column;
  align-items: center;
  .input {
    width: 300px;
    margin-right: 20px;
  }
  .btn {
    width: 100px;
    margin-top: 20px;
  }
  p {
    margin-top: 20px;
    color: #2d8cf0;
    cursor: pointer;
  }
}
</style>
