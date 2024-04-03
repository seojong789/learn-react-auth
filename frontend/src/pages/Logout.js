import { redirect } from 'react-router-dom';

// 로컬 스토리지의 토큰을 삭제하는 함수
export function action() {
  localStorage.removeItem('token');
  localStorage.removeItem('expiration');
  return redirect('/');
}
