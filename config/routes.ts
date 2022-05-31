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
