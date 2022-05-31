export * from './';


export function listToTree(arr: any[], id = 'id', pid = 'pid') {
  const t = new Array(0);
  // eslint-disable-next-line no-return-assign,no-sequences
  const map = arr.reduce((res, item) => ((res[item[id]] = { ...item }), res), {});
  Object.values(map).forEach((item) => {
    // @ts-ignore
    if (!item[pid]) {
      t.push(item);
    } else {
      // @ts-ignore
      const parent = map[item[pid]];
      parent.children = parent.children || [];
      parent.children.push(item);
    }
  });

  return t;
}
