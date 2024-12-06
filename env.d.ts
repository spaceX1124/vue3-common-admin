/// <reference types="vite/client" />

import 'vue-router'
import type { Component } from 'vue'

interface IRouteMeta {
    icon?: Component | string;
    title?: string;
    order?: number;
    hideInMenu?: boolean;
}
declare module 'vue-router' {
    interface RouteMeta extends IRouteMeta {}
}
