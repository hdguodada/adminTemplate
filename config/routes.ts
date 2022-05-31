export default [
  {
    path: '/user',
    layout: false,
    routes: [
      { name: '登录', path: '/user/login', component: './user/Login' },
      { component: './404' },
    ],
  },
  {
    path: '/Question',
    name: '题库管理',
    component: './Question',
  },
  {
    path: '/Q_bank_config/:id',
    hideInMenu: true,
    name: '题库配置',
    parentKeys: ['/Question'],
    component: './Question/Q_bank_config',
  },
  {
    path: '/sys',
    name: '平台管理',
    icon: 'crown',
    routes: [
      { path: 'account', name: '账号管理', component: './Admin' },
      { path: 'role', name: '角色管理', component: './Role' },
    ],
  },
  { component: './404' },
];
