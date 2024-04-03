import {
  Outlet,
  useLoaderData,
  useNavigation,
  useSubmit,
} from 'react-router-dom';

import MainNavigation from '../components/MainNavigation';
import { useEffect } from 'react';
import { getTokenDuration } from '../util/auth';

function RootLayout() {
  // const navigation = useNavigation();

  // token의 유무가 의존성이 되어야 함.
  const token = useLoaderData();
  // MainNavigation.js의 Logout Form 양식을 전송하기 위한 훅
  const submit = useSubmit();

  useEffect(() => {
    // 토큰이 없으면 아무런 행동도 하지 않음.
    if (!token) {
      return;
    }

    // 만료된 토큰인지 확인 - util/auth.js에서 확인이 가능함.
    if (token === 'EXPIRED') {
      submit(null, { action: '/logout', method: 'post' }); // 로그아웃
      return; // 만료되었으니 아래 코드 동작할 필요없어서 return
    }

    const tokenDuration = getTokenDuration();
    console.log(tokenDuration);

    // 토큰이 존재 -> 타이머 설정
    setTimeout(() => {
      /*
      null = 전송할 데이터가 없음.
      action: 'logout' = App.js에서 logout 라우터에 연결된 action 함수를 사용함
      즉, 토큰을 제거하게 된다.
      */
      submit(null, { action: '/logout', method: 'post' });
    }, tokenDuration);
  }, [token, submit]);

  return (
    <>
      <MainNavigation />
      <main>
        {/* {navigation.state === 'loading' && <p>Loading...</p>} */}
        <Outlet />
      </main>
    </>
  );
}

export default RootLayout;
