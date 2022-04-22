import { useParams } from 'react-router-dom';

const Diary = () => {
  const { id } = useParams();
  //diary: id  이렇게 지정해서 id로 써야함
  return (
    <div>
      <h2>diary</h2>
      <p>이곳은 이곳은 일기 상세 페이지입니다.</p>
    </div>
  );
};

export default Diary;
