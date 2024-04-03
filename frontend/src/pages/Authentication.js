import { json, redirect } from 'react-router-dom';
import AuthForm from '../components/AuthForm';

function AuthenticationPage() {
  return <AuthForm />;
}

export default AuthenticationPage;

// request : AuthForm으로 전송되는 양식에 대해 접근이 필요하기 때문에 사용(await request.formData();)
/* 
request는 쿼리 매개변수에 따라서 다르게 보내야 함. (login, signup)
그러나, action 함수 내부에서 useSearchParams 사용 불가능.
-> 브라우저가 제공하는 URL 생성자 함수 사용.
*/
export async function action({ request }) {
  const searchParams = new URL(request.url).searchParams;
  const mode = searchParams.get('mode') || 'login'; // AuthForm에서 쿼리 매개변수를 ?mode=로 지정했음.

  // 사용자가 주소를 강제로 ?mode=abc 등으로 바꾸는 걸 방지하기 위한 유효성 검사.
  if (mode !== 'signup' && mode !== 'login') {
    throw json({ message: '지원하지 않는 모드입니다.' }, { status: 422 });
  }

  const data = await request.formData();
  const authData = {
    email: data.get('email'), // email, password : AuthForm에서 입력의 name 프롭에 해당함.
    password: data.get('password'),
  };

  // mode 변수를 통해 어떤 mode인지 알 수 있으므로, 해당 mode에 맞게 요청 가능 (mode는 signup 아니면 login)
  const response = await fetch('http://localhost:8080/' + mode, {
    method: 'POST', // 로그인, 회원가입은 둘 다 POST
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(authData),
  });

  // 지원하지 않는 모드이거나, 가입하지 않는 사용자가 로그인하는 할 경우 오류 처리.
  if (response.status === 422 || response.status === 401) {
    return response; // AuthForm에서 해당 오류메시지를 ui로 출력하기 위해 반환.
  }

  if (!response.ok) {
    throw json({ message: 'Could not authenticate user.' }, { status: 500 });
  }

  // backend/routes/auth.js에서 token을 반환함. 즉, response에 token이 포함되어 있음.
  const resData = await response.json();
  const token = resData.token;

  // token은 로컬 스토리지, 세션 스토리지, 쿠키, 메모리 등에 저장될 수 있음.
  // 'token' = key
  localStorage.setItem('token', token);

  /* 
  백엔드에서 토큰의 만료시간은 1시간으로 설정하고 Root.js에서 setTimer로 1시간 뒤에 로그아웃 하도록 설정함.
  그러나, 사용자가 로그인 하고 10분 뒤에 페이지를 새로고침하면 다시 useEffect에 의해 타이머가 1시간으로 리셋됨.
  즉, backend에서 정한 1시간과 차이가 발생함.
  따라서 만료 날짜를 계산해야 한다.
  */
  const expiration = new Date();

  // backend에서 토큰 만료 시간을 1시간으로 설정함.
  expiration.setHours(expiration.getHours() + 1);

  // 해당 만료 날짜를 표준화된 스트링으로 변환함.
  localStorage.setItem('expiration', expiration.toISOString());

  return redirect('/'); // 로그인 성공 - Home으로 이동.
}
