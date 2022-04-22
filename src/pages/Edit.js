import { useNavigate, useSearchParams } from 'react-router-dom';

const Edit = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParmas] = useSearchParams();

  const id = searchParams.get('id');
  console.log('id : ', id);

  const mode = searchParams.get('mode');
  console.log('mode :', mode);
  return (
    <div>
      <h2>edit</h2>
      <p>이곳은 이곳은 일기 수정 페이지입니다.</p>
      <button onClick={() => setSearchParmas({ abc: 'efg' })}>
        파람 바꿔버리기
      </button>
      <button onClick={() => navigate('/home')}>홈으로 가기</button>
      <button onClick={() => navigate(-1)}>뒤로가기</button>
    </div>
  );
};

export default Edit;
