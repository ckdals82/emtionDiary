import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DiaryStateContext } from '../App';
import MyButton from '../components/MyButton';
import MyHeader from '../components/MyHeader';

import { getStringDate } from '../utill/date';

const Diary = () => {
  const { id } = useParams();
  const diaryList = useContext(DiaryStateContext);
  const navigate = useNavigate();
  const [data, setData] = useState();

  useEffect(() => {
    if (diaryList.length >= 1) {
      const targetDiary = diaryList.find(
        (it) => parseInt(it.id) === parseInt(id)
      );
      console.log(targetDiary);

      if (targetDiary) {
        //일기가 있을때
        setData(targetDiary);
      } else {
        //일기가 없을때
        alert('없는 일기입니다.');
        navigate('/', { replace: true });
      }
    }
  }, [id, diaryList]);
  //diary: id  이렇게 지정해서 id로 써야함

  if (!data) {
    return <div className='DiaryPage'>로딩중입니다.</div>;
  } else {
    return (
      <div className='DiaryPage'>
        <MyHeader
          headText={`${getStringDate(new Date(data.date))}의 기록`}
          leftChild={
            <MyButton text={'< 뒤로가기'} onClick={() => navigate(-1)} />
          }
          rightChild={
            <MyButton
              text={'수정하기'}
              onClick={() => navigate(`/edit/${data.id}`)}
            />
          }
        />
      </div>
    );
  }
};

export default Diary;
