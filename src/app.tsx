import type { Settings as LayoutSettings } from '@ant-design/pro-layout';
import { PageLoading, SettingDrawer } from '@ant-design/pro-layout';
import { history } from 'umi';
import RightContent from '@/components/RightContent';
import Footer from '@/components/Footer';
import { LinkOutlined } from '@ant-design/icons';
import defaultSettings from '../config/defaultSettings';
import { getCurrentUser } from '@/services/account';
import type { RequestConfig, RunTimeLayoutConfig } from 'umi';

const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/user/login';

/** 获取用户信息比较慢的时候会展示一个 loading */
export const initialStateConfig = {
  loading: <PageLoading />,
};

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: API.CurrentUser;
  loading?: boolean;
  fetchUserInfo?: () => Promise<API.CurrentUser | undefined>;
  globalDataLoaded?: boolean;
}> {
  const fetchUserInfo = async () => {
    try {
      const token = localStorage.getItem('token');
      const msg = await getCurrentUser({
        token: token,
      });
      return {
        ...msg.data,
      };
    } catch (error) {
      history.push(loginPath);
    }
    return undefined;
  };
  // 如果不是登录页面，执行
  if (history.location.pathname !== loginPath) {
    const currentUser = await fetchUserInfo();
    return {
      fetchUserInfo,
      currentUser,
      settings: defaultSettings,
      globalDataLoaded: false,
    };
  }
  return {
    fetchUserInfo,
    settings: defaultSettings,
  };
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState, setInitialState }) => {
  return {
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    waterMarkProps: {
      content: initialState?.currentUser?.name,
    },
    footerRender: () => <Footer />,
    onPageChange: () => {
      // const { location } = history;
      // 如果没有登录，重定向到 login
      // if (!initialState?.currentUser && location.pathname !== loginPath) {
      //   history.push(loginPath);
      // }
    },
    links: isDev
      ? [
        <a key="openapi" href="http://192.168.31.54:7622/swagger-ui.html#/" target="_blank">
          <LinkOutlined />
          <span>Swagger</span>
        </a>,
      ]
      : [],
    menuHeaderRender: undefined,
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    // 增加一个 loading 的状态
    childrenRender: (children: any, props: any) => {
      // if (initialState?.loading) return <PageLoading />;
      return (
        <>
          {children}
          {!props.location?.pathname?.includes('/login') && (
            <SettingDrawer
              disableUrlParams
              enableDarkTheme
              settings={initialState?.settings}
              onSettingChange={(settings) => {
                setInitialState((preInitialState: any) => ({
                  ...preInitialState,
                  settings,
                }));
              }}
            />
          )}
        </>
      );
    },
    ...initialState?.settings,
  };
};

//
/** 异常处理程序 */
// const errorHandler = (error: ResponseError) => {
//   const { response } = error;
//   if (response && response.status) {
//     const errorText = codeMessage[response.status] || response.statusText;
//     const { status, url } = response;
//
//     notification.error({
//       message: `请求错误 ${status}: ${url}`,
//       description: errorText,
//     });
//   }
//
//   if (!response) {
//     notification.error({
//       message: error.message,
//     });
//   }
//   throw error;
// };

/** 请求拦截器 */
const authHeaderInterceptor = (url: string, options: any) => {
  const token = localStorage.getItem('token');
  const authHeader = { ...options.headers, accessToken: `${token}` };
  return {
    url: url,
    options: { ...options, interceptors: true, headers: authHeader },
  };
};
/** 响应拦截 增加延时 */
const demoResponseInterceptors = async (response: Response) => {
  try {
    const data = await response.clone().json();
    if (data.code !== '0') {
      return Promise.reject(new Error(data.msg || 'Error'));
    }
    return response;
  } catch (e) {
    return response;
  }
};

export const request: RequestConfig = {
  // errorHandler,
  requestInterceptors: [authHeaderInterceptor],
  responseInterceptors: [demoResponseInterceptors],
};
