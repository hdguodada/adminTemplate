import { LockOutlined, MobileOutlined, UserOutlined } from '@ant-design/icons';
import { Alert, message, Tabs } from 'antd';
import React, { useState } from 'react';
import { LoginForm, ProFormText } from '@ant-design/pro-form';
import { history, useModel } from 'umi';
import { login } from '@/services/account';
import styles from './index.less';

const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);
// const ImageCode: React.FC = () => {
//   const { data, run } = useRequest<MyResponse<string>>(getImageCode, {
//     onSuccess(d) {
//       console.log(d);
//     },
//   });
//   return <img src={data} width={75} alt={'验证码'} onClick={run} />;
// };
const Login: React.FC = () => {
  const [userLoginState, setUserLoginState] = useState<API.LoginResult>({});
  const { initialState, setInitialState } = useModel('@@initialState');
  const [type, setType] = useState<string>('account');
  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();

    if (userInfo) {
      await setInitialState((s) => ({ ...s, currentUser: userInfo }));
    }
  };

  const handleSubmit = async (values: API.LoginParams) => {
    try {
      // 登录
      const msg = await login({ ...values }, type);

      if (msg.code === '0') {
        const defaultLoginSuccessMessage = '登录成功！';
        message.success(defaultLoginSuccessMessage);
        const token = msg.data;
        localStorage.setItem('token', token);
        await fetchUserInfo();
        /** 此方法会跳转到 redirect 参数所在的位置 */
        if (!history) return;
        const { query } = history.location;
        const { redirect } = query as {
          redirect: string;
        };
        console.log('redirect', redirect);
        history.push(redirect || '/');
        return;
      }
      console.log(msg); // 如果失败去设置用户错误信息
      setUserLoginState({
        status: 'error',
        type: 'mobile',
      });
    } catch (error) {
      const defaultLoginFailureMessage = '登录失败，请重试！';
      message.error(defaultLoginFailureMessage);
    }
  };

  const { status, type: loginType } = userLoginState;
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <LoginForm
          title="后台"
          style={{ marginTop: '2rem' }}
          initialValues={{
            autoLogin: true,
          }}
          onFinish={async (values) => {
            await handleSubmit(values as API.LoginParams);
          }}
        >
          <Tabs activeKey={type} onChange={setType} size={'large'} centered type={'card'}>
            <Tabs.TabPane key="account" tab={'账号登录'} />
            <Tabs.TabPane key="mobile" tab={'手机登录'} />
          </Tabs>
          {status === 'error' && loginType === 'account' && (
            <LoginMessage content={'错误的用户名和密码'} />
          )}
          {status === 'error' && loginType === 'mobile' && <LoginMessage content="密码错误" />}
          {type === 'account' && (
            <>
              <ProFormText
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined className={styles.prefixIcon} />,
                }}
                name="socialCode"
                placeholder={'请输入信用机构号码'}
                rules={[
                  {
                    required: true,
                    message: '信用机构号码是必填项！',
                  },
                ]}
              />
              <ProFormText.Password
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined className={styles.prefixIcon} />,
                }}
                name="pwd"
                placeholder={'请输入密码！'}
                rules={[
                  {
                    required: true,
                    message: '密码是必填项！',
                  },
                ]}
              />
              {/*<ProFormText*/}
              {/*  fieldProps={{*/}
              {/*    size: 'large',*/}
              {/*    prefix: <ImageCode />,*/}
              {/*  }}*/}
              {/*  name="imageCode"*/}
              {/*  placeholder={'请输入验证码'}*/}
              {/*  rules={[*/}
              {/*    {*/}
              {/*      required: true,*/}
              {/*      message: '请输入验证码！',*/}
              {/*    },*/}
              {/*  ]}*/}
              {/*/>*/}
            </>
          )}
          {type === 'mobile' && (
            <>
              <ProFormText
                fieldProps={{
                  size: 'large',
                  prefix: <MobileOutlined className={styles.prefixIcon} />,
                }}
                name="phone"
                placeholder={'请输入手机号！'}
                rules={[
                  {
                    required: true,
                    message: '手机号是必填项！',
                  },
                  // {
                  //   pattern: /^1\d{10}$/,
                  //   message: '不合法的手机号！',
                  // },
                ]}
              />
              <ProFormText.Password
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined className={styles.prefixIcon} />,
                }}
                name="pwd"
                placeholder={'请输入密码！'}
                rules={[
                  {
                    required: true,
                    message: '密码是必填项！',
                  },
                  // {
                  //   pattern: /^1\d{10}$/,
                  //   message: '不合法的手机号！',
                  // },
                ]}
              />
            </>
          )}
        </LoginForm>
      </div>
    </div>
  );
};

export default Login;
