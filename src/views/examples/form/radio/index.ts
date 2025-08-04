import type { ISchema } from '@/adapter'
import type { FormMethods } from '@/packages/ui/forms'
import { select } from '@/libs/requestAddress.ts'
export function getFieldList (baseFormApi: FormMethods):ISchema[] {
  return [
    {
      fieldKey: 'key1',
      component: 'RadioGroup',
      fieldName: '普通单选',
      componentProps: {
        options: [{ label: '篮球', value: 1 }, { label: '足球', value: 2 }, { label: '乒乓球', value: 3 }]
      },
      useForm: true,
      required: true
    },
    {
      fieldKey: 'key2',
      component: 'RadioGroup',
      fieldName: '普通单选-禁用选项',
      componentProps: {
        options: [{ label: '篮球', value: 1 }, { label: '足球', value: 2, disabled: true }, { label: '乒乓球', value: 3 }]
      },
      useForm: true,
      required: true
    },
    {
      fieldKey: 'key3',
      component: 'RadioGroup',
      fieldName: '普通单选按钮',
      componentProps: {
        options: [{ label: '篮球', value: 1 }, { label: '足球', value: 2 }, { label: '乒乓球', value: 3 }],
        isButton: true
      },
      useForm: true,
      required: true
    },
    {
      fieldKey: 'key4',
      component: 'ApiRadioGroup',
      fieldName: '单选-可取消选中',
      componentProps: {
        options: [{ label: '篮球', value: 1 }, { label: '足球', value: 2 }, { label: '乒乓球', value: 3 }]
      },
      useForm: true,
      required: true
    },
    {
      fieldKey: 'key5',
      component: 'ApiRadioGroup',
      fieldName: '异步单选',
      async: {
        url: select.selectList,
        method: 'post',
        label: 'name',
        value: 'id'
      },
      useForm: true,
      required: true
    },
    {
      fieldKey: 'key6',
      component: 'RadioSelect',
      fieldName: '普通单选+普通下拉',
      componentProps: {
        options: [{ label: '篮球', value: 1 }, { label: '足球', value: 2 }, { label: '乒乓球', value: 3 }]
      },
      componentEvent: {
        onChange: (value: string) => {
          baseFormApi.updateFieldProperty('key6', 'mergeSchema.formHidden', value !== '3')
          baseFormApi.clearFieldValue('key7')
        }
      },
      useForm: true,
      required: true,
      mergeSchema: {
        fieldKey: 'key7',
        fieldName: '普通下拉',
        component: 'Select',
        componentProps: {
          options: [{ label: '篮球', value: 1 }, { label: '足球', value: 2 }]
        },
        useForm: true,
        required: true,
        hideLabel: true,
        formHidden: true
      }
    },
    {
      fieldKey: 'key8',
      component: 'RadioSelect',
      fieldName: '异步单选+异步下拉',
      async: {
        url: select.selectList,
        method: 'post',
        label: 'name',
        value: 'id'
      },
      componentEvent: {
        onChange: (value: string) => {
          baseFormApi.updateFieldProperty('key8', 'mergeSchema.formHidden', value !== '3')
          baseFormApi.clearFieldValue('key9')
        }
      },
      useForm: true,
      required: true,
      mergeSchema: {
        fieldKey: 'key9',
        fieldName: '异步下拉',
        component: 'ApiSelect',
        async: {
          url: select.selectList,
          method: 'post',
          label: 'name',
          value: 'id'
        },
        useForm: true,
        required: true,
        hideLabel: true,
        formHidden: true
      }
    }
  ]
}
