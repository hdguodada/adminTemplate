import { Settings as LayoutSettings } from '@ant-design/pro-layout';

const Settings: LayoutSettings & {
  pwa?: boolean;
  logo?: string;
} = {
  "navTheme": "light",
  "primaryColor": "#1890ff",
  "layout": "mix",
  "contentWidth": "Fluid",
  "fixedHeader": false,
  "fixSiderbar": true,
  "pwa": false,
  "headerHeight": 48,
  "splitMenus": true,
  title: '东阳工会后台管理',
}

export default Settings;
