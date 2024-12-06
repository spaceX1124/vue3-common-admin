import { type Component } from 'vue'
export interface IBreadcrumb {
    icon?: Component | string;
    items?: IBreadcrumb[];
    path?: string;
    title?: string;
}