import { DefaultFooter } from '@ant-design/pro-layout';
import { history, useModel, useRequest } from 'umi';

const Footer: React.FC = () => {
  const { setInitialState, initialState } = useModel('@@initialState', (model) => ({
    setInitialState: model.setInitialState,
    initialState: model.initialState,
  }));

  const { queryDeps } = useModel('dept', (model) => ({
    queryDeps: model.queryDep,
  }));
  const { queryRoles } = useModel('role', (model) => ({
    queryRoles: model.queryRoles,
  }));


  useRequest(
    async () => {
      if (history.location.pathname !== '/user/login') {
        await Promise.all([queryDeps() ,queryRoles()]);
      }
      return {
        data: undefined,
        success: true,
      };
    },
    {
      onSuccess() {
        setInitialState({
          ...initialState,
          globalDataLoaded: true,
        });
      },
    },
  );
  const defaultMessage = '数字东阳技术运营有限公司';
  const currentYear = new Date().getFullYear();
  return <DefaultFooter copyright={`${currentYear} ${defaultMessage}`} links={[]} />;
};

export default Footer;
