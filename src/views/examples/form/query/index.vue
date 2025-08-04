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

userPhone.value = '131' + Math.random().toString(10).slice(-8)

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
    car: 2, // 车产情况 1：无车产 2：有车
    creditCard: 2, // 信用卡 1：无信用卡 2:有信用卡
    gjj: 3, // 公积金  1：无公积金 2：缴纳未满6个月 3：缴纳6个月以上
    house: 1, // 房产情况 1：无房产 2：有房
    sesame: 3, // 芝麻分 1：无芝麻分 2：600分以下 3：600~650分 4：650~700分 5：700分以上
    socialInsurance: 1, // 社保 1：无社保 2：缴纳未满6个月 3：缴纳6个月以上
    insurancePolicy: 1, // 保单 1：无保单 :2：缴纳不足一年 :3：缴纳1年以上 4：缴纳2年以上
    loanAmount: 5, // 贷款金额(单位：万元) 最小1 最高20
    loanTerm: 3, // 借款期限(月) 最小1 最大36
    monthlyIncome: 4, // 月收入 1： 2000以下 2：2000-5000 3：5000-10000 4：10000以上
    payType: 1, // 工资发放形式 1：银行卡  2：现金 3：自存
    profession: 5, // 职业 1：上班族 2：公务员/事业单位 3：私营业主（有营业执照） 4：个体户（无营业执照） 5其他
    qualification: 5, // 学历 1：初中及以下 2：高中或中专 3：大专 4：本科 5：研究生及以上
    creditInformation: 2, // 人行征信情况 1：无人行征信记录  2：人行征信良好无逾期  3：人行征信近2两年有60天以内的逾期  4：人行征信近2两年有60天以上逾期  5：人行征信近两年有90天以上逾期
    workAge: 3, // 工龄 1：0~6个月 2：6~12个月 3：12个月以上,
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
