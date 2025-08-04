import ChinaAddressV4Data from '@/components/business/form/select-city-modal/china_address_vant.ts'

const TimeArr: any = []
for (let i = 0; i < 24; i++) {
  TimeArr.push({ label: i + '时', value: `${i}` })
}
interface ICityType {
  label: string,
  value: string,
  children: ICityType[]
}
/**
 * 树形-省/市
 * */
function getCityListFunction () {
  const provinceList: { [propName: number]: string } = ChinaAddressV4Data.province_list
  const cityList: { [propName: number]: string } = ChinaAddressV4Data.city_list
  const parent: any[] = []
  for (const i in provinceList) {
    const pObj: ICityType = {
      value: i,
      label: provinceList[i],
      children: []
    }
    for (const j in cityList) {
      if (Number(j) - Number(i) > 0 && Number(j) - Number(i) <= 10000) {
        const subObj: ICityType = {
          value: j,
          label: cityList[j],
          children: []
        }
        pObj.children.push(subObj)
      }
    }
    parent.push(pObj)
  }
  return parent
}

/**
 * 树形-省/市/区
 * */
function getAreaListFunction () {
  const provinceList: { [propName: number]: string } = ChinaAddressV4Data.province_list
  const cityList: { [propName: number]: string } = ChinaAddressV4Data.city_list
  const areaList: { [propName: number]: string } = ChinaAddressV4Data.county_list
  const parent: any[] = []
  for (const i in provinceList) {
    const pObj: ICityType = {
      value: i,
      label: provinceList[i],
      children: []
    }
    for (const j in cityList) {
      if (Number(j) - Number(i) > 0 && Number(j) - Number(i) <= 10000) {
        const subObj: ICityType = {
          value: j,
          label: cityList[j],
          children: []
        }
        pObj.children.push(subObj)
        for (const k in areaList) {
          if (Number(k) - Number(j) > 0 && Number(k) - Number(j) <= 100) {
            const sonObj: ICityType = {
              value: k,
              label: areaList[k],
              children: []
            }
            subObj.children.push(sonObj)
          }
        }
      }
    }
    parent.push(pObj)
  }
  return parent
}

const businessList = {
  cityList: getCityListFunction(), // 省/市
  areaList: getAreaListFunction(), // 省/市/区
  hoursList: TimeArr,
  checkType_: [
    { label: '待审核', value: 0 },
    { label: '审核通过', value: 1 },
    { label: '审核失败', value: 2 }
  ],
  customerType: [
    { label: '个人客户', value: 1 },
    { label: '企业客户', value: 2 }
  ],
  propertyType: [
    { label: '房产类型', value: 1 },
    { label: '车产类型', value: 2 },
    { label: '公积金类型', value: 3 },
    { label: '社保类型', value: 5 },
    { label: '公务员类型', value: 4 },
    { label: '不限', value: 0 }
  ],
  houseType: [
    { label: '不限制', value: 0 },
    { label: '商品房', value: 1 },
    { label: '安置房', value: 2 },
    { label: '宅基地', value: 3 },
    { label: '商铺/厂房', value: 4 }
  ],
  carOperateType: [
    { label: '不限制', value: 0 },
    { label: '营运', value: 1 },
    { label: '非营运', value: 2 }
  ],
  carEnergyType: [
    { label: '不限制', value: 0 },
    { label: '燃油', value: 1 },
    { label: '新能源', value: 2 }
  ],
  carAgeType: [
    { label: '不限制', value: 0 },
    { label: '2年以内', value: 1 },
    { label: '4年以内', value: 2 },
    { label: '6年以内', value: 3 },
    { label: '8年以内', value: 4 },
    { label: '10年以内', value: 5 }
  ],
  carKiType: [
    { label: '不限制', value: 0 },
    { label: '2万公里以内', value: 1 },
    { label: '4万公里以内', value: 2 },
    { label: '6万公里以内', value: 3 },
    { label: '8万公里以内', value: 4 },
    { label: '10万公里以内', value: 5 }
  ],
  gjjRatioType: [
    { label: '不限制', value: 0 },
    { label: '3%及以上', value: 1 },
    { label: '6%及以上', value: 2 },
    { label: '9%及以上', value: 3 },
    { label: '12%以上', value: 4 }
  ],
  gjjAgeType: [
    { label: '不限制', value: 0 },
    { label: '半年以上', value: 1 },
    { label: '一年以上', value: 2 },
    { label: '两年以上', value: 3 }
  ],
  yearType: [
    { label: '不限制', value: 0 },
    { label: '一年以上', value: 1 },
    { label: '两年以上', value: 2 },
    { label: '三年以上', value: 3 },
    { label: '五年以上', value: 4 }
  ],
  taxGradeList: [
    { label: '不限制', value: 0 },
    { label: 'A++', value: 1 },
    { label: 'A+', value: 2 },
    { label: 'A', value: 3 },
    { label: 'A-', value: 4 },
    { label: 'B+', value: 5 },
    { label: 'B-', value: 6 },
    { label: 'C', value: 7 }
  ],
  customerXQType: [
    { label: '不限制', value: 0 },
    { label: '一万以上', value: 1 },
    { label: '3万以上', value: 2 },
    { label: '5万以上', value: 3 },
    { label: '10万以上', value: 4 }
  ],
  arrivalTimeType: [
    {
      label: '白天（上午9:00-下午18:00）', value: 1
    },
    {
      label: '自定义上线时段', value: 2
    }
  ],
  weekList: [
    { label: '周一', value: 1 },
    { label: '周二', value: 2 },
    { label: '周三', value: 3 },
    { label: '周四', value: 4 },
    { label: '周五', value: 5 },
    { label: '周六', value: 6 },
    { label: '周天', value: 7 }
  ],
  vehicleValuation: [
    { label: '不限制', value: 0 },
    { label: '3万以上', value: 1 },
    { label: '5万以上', value: 2 },
    { label: '8万以上', value: 3 },
    { label: '10万以上', value: 4 },
    { label: '15万以上', value: 5 },
    { label: '20万以上', value: 6 }
  ],
  invitationType: [
    { label: '到店', value: 1 },
    { label: '精准线索', value: 2 }
  ],
  channelType: [
    { label: '普通贷超', value: 1 },
    { label: '头部拒量', value: 2 },
    { label: '公众号', value: 3 },
    { label: '短信', value: 4 },
    { label: '信息流', value: 5 },
    { label: '其他', value: 6 }
  ],
  djType: [
    { label: 'H5uv', value: 1 },
    { label: 'H5联登', value: 2 },
    { label: 'API表单', value: 3 }
  ],
  jsType: [{ label: 'CPA', value: 1 }],
  zkType: [
    { label: '不撞库', value: 1 },
    { label: '撞库', value: 2 }
  ],
  filterTypeType: [
    { label: '房产', value: 1 },
    { label: '车产', value: 2 },
    { label: '公积金', value: 3 },
    { label: '企业', value: 4 },
    { label: '公务员', value: 5 },
    { label: '社保', value: 8 }
  ],
  shzzType: [
    { label: '社保', value: 1 },
    { label: '公积金', value: 2 },
    { label: '房', value: 3 },
    { label: '车', value: 4 }
  ],
  onlineType: [
    { label: '白天（上午9:00-下午18:00）', value: 1 },
    { label: '夜间（晚上22:00-凌晨6:00）', value: 2 },
    { label: '自定义时间段', value: 3 }
  ],
  onlineType_: [
    { text: '9:00-18:00', value: 1 },
    { text: '22:00-6:00', value: 2 },
    { text: '自定义时间段', value: 3 }
  ],
  cycleType: [
    { label: '每天', value: 1 },
    { label: '工作日（周一至周五）', value: 2 },
    { label: '周末（周六、周天）', value: 3 },
    { label: '自定义周期', value: 4 }
  ],
  cycleType_: [
    { label: '每天', value: 1 },
    { label: '周一 至 周五', value: 2 },
    { label: '周六、 周天', value: 3 },
    { label: '自定义周期', value: 4 }
  ],
  channelStatus_: [
    { label: '下线', value: 0 },
    { label: '上线', value: 1 }
  ],
  cooperation: [
    { label: '云saas', value: 1 },
    { label: 'api机构', value: 2 }
  ],
  sexList: [{ label: '女', value: 0 }, { label: '男', value: 1 }]
}
export default businessList