/*
Authentication.js에서 token을 localStorage에 저장함.
이를 가져오기 위한 helper function
*/

import { redirect } from 'react-router-dom';

// 토큰 만료 시간을 계산하기 위해 필요한 함수
export function getTokenDuration() {
  const storedExpirationDate = localStorage.getItem('expiration');
  const expirationDate = new Date(storedExpirationDate);
  const now = new Date();

  /* 
  expirationDate - now가 토큰의 최종 유효 시간
  getTime() = 시간값을 밀리초 단위로 제공함.
  duration의 값이 양수라면 토큰이 아직 유효하고 음수라면 만료된 것이다.
  */
  const duration = expirationDate.getTime() - now.getTime();
  return duration;
}

export function getAuthToken() {
  // getItem 메소드는 key를 통해 값을 가져온다.
  const token = localStorage.getItem('token');

  /* 
  token이 없다면 아래 토큰 만료 시간을 업데이트 할 이유가 없음.
  이를 처리해주지 않으면 항상 토큰은 EXPIRED를 return하므로 UI가 제대로 동작하지 않음.
  */
  if (!token) {
    return null;
  }

  // 토큰 만료 시간 업데이트
  const tokenDuration = getTokenDuration();

  if (tokenDuration < 0) {
    return 'EXPIRED';
  }

  return token;
}

/* 
Logout 버튼을 눌렀을 때, 토큰이 사라지니까 Authentication Ui가 나타나야 함.
다시 로그인할 경우, 사라져야 함.
이를 App.js에서 loader를 통해 관리하면 알아서 다 해준다. 이를 위한 helper function
*/
export function tokenLoader() {
  return getAuthToken();
}

export function checkAuthLoader() {
  /*
  loader는 반드시 값 or null을 리턴해야 한다.
  이를 처리해주지 않으면 오류가 발생함.
  */
  const token = getAuthToken();
  window.alert('권한이 없습니다.');

  if (!token) {
    return redirect('/auth');
  }

  return null;
}
