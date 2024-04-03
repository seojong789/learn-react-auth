import {
  Form,
  Link,
  useSearchParams,
  useActionData,
  useNavigation,
} from 'react-router-dom';

import classes from './AuthForm.module.css';

function AuthForm() {
  // const [isLogin, setIsLogin] = useState(true);

  // function switchAuthHandler() {
  //   setIsLogin((isCurrentlyLogin) => !isCurrentlyLogin);
  // }

  /* 
  위 코드를 쿼리 매개변수 로직으로 변경 = useSearchParams 훅 사용
  state처럼 두 번째 파라미터는 업데이트 함수인데, 해당 Form에서는 mode?=${} 를 통해 동적으로 관리하기 때문에 업데이트 함수는 필요없다.
  */
  const [searchParams] = useSearchParams();
  const isLogin = searchParams.get('mode') === 'login';

  /*
  Authentication에서 반환하는 데이터를 담고 있음.
  만약 422, 401 오류에 해당하는 response 객체가 반환되면 해당 내용을 UI로 출력해줘야 함.
  */
  const data = useActionData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';

  return (
    <>
      <Form method="post" className={classes.form}>
        <h1>{isLogin ? 'Log in' : 'Create a new user'}</h1>

        {/* data가 422, 401 에러 객체를 반환했을 경우 유효성 검사 UI 출력 */}
        {data && data.errors && (
          <ul>
            {Object.values(data.errors).map((err) => (
              <li key={err}>{err}</li>
            ))}
          </ul>
        )}
        {data && data.message && <p>{data.message}</p>}
        <p>
          <label htmlFor="email">Email</label>
          <input id="email" type="email" name="email" required />
        </p>
        <p>
          <label htmlFor="image">Password</label>
          <input id="password" type="password" name="password" required />
        </p>
        <div className={classes.actions}>
          {/* <button onClick={switchAuthHandler} type="button">
            {isLogin ? 'Create new user' : 'Login'}
          </button> */}
          <Link to={`?mode=${isLogin ? 'signup' : 'login'}`}>
            {isLogin ? 'Create new user' : 'Login'}
          </Link>
          <button disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Save'}
          </button>
        </div>
      </Form>
    </>
  );
}

export default AuthForm;
