import React, { Suspense } from 'react';
import Skeleton from 'common/components/Skeleton';
// MarvelList组件将按需加载
const MarvelList = React.lazy(() => import('./MarvelList'));

export default function MarvelListPage() {
  return (
    <Suspense fallback={<Skeleton />}>
      <MarvelList />
    </Suspense>
  );
}
