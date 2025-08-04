<template>
  <div>
    <div
      class="showCityStyle pointer"
      @click="showCity"
      :class="{
        disabledStyle: true,
        isCityStyle: selectedCity.length
      }">
      {{selectedCity.length ? selectedCity.join(',') : `点击${fieldName || '城市'}选择`}}
    </div>
    <Dialog
      v-model="show"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      :title="fieldName || '城市选择'"
      @confirm="confirm"
      width="700px"
    >
      <el-button type="primary" size="small" @click="clickAll">{{isCheckAll ? '取消全选' : '全选'}}</el-button>
      <div class="content_wrap" v-if="show">
        <template v-for="(province, index) in showTreeData" :key="index">
          <div class="parent_item" v-if="province.children.length">
            <!-- :show-after="200"为了鼠标移上去没有那么快弹出来 -->
            <el-popover
              placement="top"
              trigger="hover"
              width="500"
              :show-after="200"
            >
              <template #reference>
                <!-- 省 -->
                <el-checkbox
                  v-model="province.checkAll"
                  :indeterminate="province.isIndeterminate || false"
                  @change="checkAllProvince($event as boolean, province)"
                >{{ province.label }}
                </el-checkbox>
              </template>
              <!-- 市 -->
              <el-checkbox
                v-for="(city, childIndex) in province.children"
                :key="childIndex"
                v-model="city.isCheck"
                :label="city.label"
                @change="checkedCity($event as boolean, city, province)"
              />
            </el-popover>
            <span class="checked_count">
              {{
                province.isCheckChildrenCount == province.childrenCount
                  ? ''
                  : province.isCheckChildrenCount + '/' + province.childrenCount
              }}
            </span>
          </div>
        </template>
      </div>
    </Dialog>
  </div>
</template>
<script lang="ts" setup>
import Dialog from '@/components/common/dialog/Dialog.vue'

import { ref, watch } from 'vue'
import { isArray } from '@/packages/utils/is'

import ChinaAddressV4Data from './china_address_vant.ts'

interface ICityTree {
  value: string; // code
  label: string; // 省/市名称
  checkAll: boolean; // 省节点是否选中
  isIndeterminate: boolean; // 省节点是否半选
  isCheck: boolean; // 市节点是否选中
  childrenCount: number; // 省节点下面有多少个市节点
  isCheckChildrenCount: number; // 省节点中已经选中的市节点数量
  children: ICityTree[];
}
interface PropsType {
  modelValue?: any;
  fieldName?: string
}
const props = defineProps<PropsType>()
const emit = defineEmits(['update:modelValue', 'emitData'])

const show = ref(false)

function showCity () {
  show.value = true
}

// ----------start----------
// 处理省/市相关逻辑
const showTreeData = ref<ICityTree[]>([]) // 树形省/市数据
const selectedCity = ref<string[]>([]) // 已选城市数据
/**
 * 获取省-市数据结构
 * */
function getCityTree () {
  getCityListFunction()
  for (const i in showTreeData.value) {
    for (const j in showTreeData.value[i].children) {
      if (selectedCity.value.indexOf(showTreeData.value[i].children[j].label) > -1) {
        // 处理当前城市选中
        showTreeData.value[i].children[j].isCheck = true
        // 处理省节点中已经选中的市节点数量
        showTreeData.value[i].isCheckChildrenCount++
      }
    }
    // 如果省节点中已经选中的市节点数量等于市节点数量，则省节点选中
    if (showTreeData.value[i].isCheckChildrenCount === showTreeData.value[i].childrenCount) {
      showTreeData.value[i].checkAll = true
    }
    if (showTreeData.value[i].isCheckChildrenCount === 0) {
      showTreeData.value[i].checkAll = false
    }
    // 如果省节点中已经选中的市节点数量（大于0 & 小于）市节点数量，则省节点半选
    if (
      showTreeData.value[i].isCheckChildrenCount < showTreeData.value[i].childrenCount &&
        showTreeData.value[i].isCheckChildrenCount > 0
    ) {
      showTreeData.value[i].isIndeterminate = true
    }
  }
}
/**
 * 处理省/市，得到ICityTree的数据结构
 * */
function getCityListFunction () {
  // 所有省
  const provinceList: { [propName: number]: string } = ChinaAddressV4Data.province_list
  // 所有市
  const cityList: { [propName: number]: string } = ChinaAddressV4Data.city_list
  const treeData: ICityTree[] = []
  for (const i in provinceList) {
    const nodeData: ICityTree = {
      value: i,
      label: provinceList[i],
      checkAll: false,
      childrenCount: 0,
      isCheckChildrenCount: 0,
      isCheck: false,
      isIndeterminate: false,
      children: []
    }

    for (const j in cityList) {
      if (Number(j) - Number(i) > 0 && Number(j) - Number(i) <= 10000) {
        const subNodeData: ICityTree = {
          value: j,
          label: cityList[j],
          checkAll: false,
          childrenCount: 0,
          isCheckChildrenCount: 0,
          isCheck: false,
          isIndeterminate: false,
          children: []
        }
        nodeData.children.push(subNodeData)
        nodeData.childrenCount++
      }
    }
    treeData.push(nodeData)
  }
  showTreeData.value = treeData
}
// ----------end----------

// ----------start----------
// 处理省/市选中
const isCheckAll = ref(false) // 是否全选
/**
 * 处理全选
 * */
function clickAll () {
  isCheckAll.value = !isCheckAll.value
  for (const i in showTreeData.value) {
    checkAllProvince(isCheckAll.value, showTreeData.value[i])
  }
}
/**
 * 处理省的选中
 * */
function checkAllProvince (bool: boolean, province: ICityTree) {
  // 省选中，市全部选中
  if (bool) {
    for (const i in province.children) {
      province.children[i].isCheck = true
    }
    // 市选中数量
    province.isCheckChildrenCount = province.childrenCount
  } else {
    for (const i in province.children) {
      province.children[i].isCheck = false
    }
    province.isCheckChildrenCount = 0
  }
  province.isIndeterminate = false
  province.checkAll = bool
  province.isCheck = bool
}
/**
 * 处理市的选中
 * */
function checkedCity (bool: boolean, city: ICityTree, province: ICityTree) {
  let checkedCount = 0 // 已选中个数
  for (const i in province.children) {
    if (province.children[i].isCheck) {
      ++checkedCount
    }
  }
  // 省节点选中
  if (checkedCount === province.childrenCount) {
    province.checkAll = true
  }
  // 省节点半选状态
  province.isIndeterminate = checkedCount > 0 && checkedCount < province.childrenCount
  // 市选中数量
  province.isCheckChildrenCount = checkedCount
  city.isCheck = bool
}
// ----------end----------

function confirm () {
  // 市
  const cityData: { code: string[], name: string[] } = {
    code: [], // 存code
    name: [] // 存城市名
  }
  for (const j in showTreeData.value) {
    for (const k in showTreeData.value[j].children) {
      if (showTreeData.value[j].children[k].isCheck) {
        cityData.code.push(showTreeData.value[j].children[k].value)
        cityData.name.push(showTreeData.value[j].children[k].label)
      }
    }
  }
  // 根据需要来定，目前只需要返回城市名
  emit('update:modelValue', cityData.name.join(','))
  emit('emitData', cityData.name.join(','))
  show.value = false
}

watch(() => props.modelValue, (value) => {
  if (!value) {
    selectedCity.value = []
    return
  }
  selectedCity.value = isArray(value) ? value : value.split(',')
}, {
  immediate: true
})

watch(() => show.value, (val) => {
  if (val) {
    getCityTree()
  }
})
defineOptions({ inheritAttrs: false })
</script>
<style lang="scss" scoped>
.showCityStyle {
  border-radius: 4px;
  box-shadow: 0 0 0 1px #dcdfe6 inset;
  min-height: 32px;
  line-height: 32px;
  padding: 1px 11px;
  color: #a8abb2;
  &:hover {
    box-shadow: 0 0 0 1px #c0c4cc inset;
  }
  &.isCityStyle {
    box-shadow: none;
    color: #515a6e;
    padding: 1px 0;
  }
}
.content_wrap {
  max-height: 350px;
  overflow: auto;
  display: flex;
  flex-wrap: wrap;
  .parent_item {
    display: flex;
    align-items: center;
    height: 32px;
    line-height: 32px;
  }
  .checked_count {
    display: block;
    width: 50px;
    color: #409eff;
  }
}
</style>