import { type Component } from 'vue'
export interface IBreadcrumb {
    icon?: Component | string;
    path?: string;
    title?: string;
}