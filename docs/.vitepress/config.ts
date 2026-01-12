import vueJsx from "@vitejs/plugin-vue-jsx";
import { resolve } from "path";
import { defineConfig } from "vitepress";

export default defineConfig({
  title: "TDesign Pro Components",
  description: "基于 TDesign Vue Next 的高级业务组件库",
  lang: "zh-CN",
  base: "/",

  head: [["link", { rel: "icon", href: "/favicon.ico" }]],

  vite: {
    plugins: [vueJsx()],
    resolve: {
      alias: {
        "@": resolve(__dirname, "../../src"),
      },
    },
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
        },
      },
    },
  },

  themeConfig: {
    logo: "/logo.svg",
    siteTitle: "TDesign Pro Components",

    nav: [
      { text: "指南", link: "/guide/getting-started" },
      { text: "组件", link: "/components/pro-field" },
      {
        text: "更多",
        items: [
          { text: "更新日志", link: "/changelog" },
          {
            text: "GitHub",
            link: "https://github.com/wehuss/tdesign-next-pro-components",
          },
        ],
      },
    ],

    sidebar: {
      "/guide/": [
        {
          text: "开始",
          items: [
            { text: "快速上手", link: "/guide/getting-started" },
            { text: "安装", link: "/guide/installation" },
          ],
        },
      ],
      "/components/": [
        {
          text: "数据展示",
          items: [
            { text: "ProField 高级字段", link: "/components/pro-field" },
            { text: "ProTable 高级表格", link: "/components/pro-table" },
          ],
        },
        {
          text: "数据录入",
          items: [
            { text: "ProForm 高级表单", link: "/components/pro-form" },
            { text: "ModalForm 弹窗表单", link: "/components/modal-form" },
            { text: "DrawerForm 抽屉表单", link: "/components/drawer-form" },
            { text: "QueryFilter 查询筛选", link: "/components/query-filter" },
            { text: "StepsForm 分步表单", link: "/components/steps-form" },
          ],
        },
      ],
    },

    socialLinks: [
      {
        icon: "github",
        link: "https://github.com/wehuss/tdesign-next-pro-components",
      },
    ],

    footer: {
      message: "Released under the MIT License.",
      copyright: "Copyright © 2024 TDesign Pro Components Team",
    },

    search: {
      provider: "local",
    },

    outline: {
      level: [2, 3],
      label: "页面导航",
    },

    docFooter: {
      prev: "上一页",
      next: "下一页",
    },

    lastUpdated: {
      text: "最后更新于",
    },
  },

  markdown: {
    lineNumbers: true,
  },
});
