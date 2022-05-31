import React from 'react';
import { useModel } from 'umi';

const InitDataWrapper: React.FC = ({ children }) => {
  const { globalDataLoaded } = useModel('@@initialState', (model) => ({
    globalDataLoaded: model.initialState?.globalDataLoaded,
  }));
  return globalDataLoaded ? <div>{children}</div> : <div />;
};

export default InitDataWrapper;
