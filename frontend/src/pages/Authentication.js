import { json } from 'react-router-dom';
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
    header: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(authData),
  });
}
