import './App.css';
import React, { useEffect, useReducer, useRef } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Home from './pages/Home';
import New from './pages/New';
import Edit from './pages/Edit';
import Diary from './pages/Diary';

import { type } from '@testing-library/user-event/dist/type';
import axios from 'axios';

const reducer = (state, action) => {
  let newState = [];
  switch (action.type) {
    case 'INIT': {
      return action.data;
    }
    case 'CREATE': {
      newState = [action.data, ...state];
      break;
    }
    case 'REMOVE': {
      newState = state.filter((it) => it.id !== action.targetId);
      break;
    }
    case 'EDIT': {
      newState = state.map((it) =>
        it.id === action.data.id ? { ...action.data } : it
      );
      break;
    }
    default:
      return state;
  }

  //api 서버에 저장시키는 로직으로 설정
  //아래는 로컬스토리지 저장 로직
  // localStorage.setItem("diary", JSON.stringify(newState));
  return newState;
};
export const DiaryStateContext = React.createContext();
export const DiaryDispatchContext = React.createContext();
// const dummyData = [
//   {
//     id: 1,
//     emotion: 1,
//     content: '오늘의 일기 1번',
//     date: 1650282244092
//   },
//   {
//     id: 2,
//     emotion: 2,
//     content: '오늘의 일기 2번',
//     date: 1650282244093
//   },
//   {
//     id: 3,
//     emotion: 4,
//     content: '오늘의 일기 3번',
//     date: 1650282244094
//   },
//   {
//     id: 4,
//     emotion: 3,
//     content: '오늘의 일기 4번',
//     date: 1650282244095
//   },
//   {
//     id: 5,
//     emotion: 5,
//     content: '오늘의 일기 5번',
//     date: 1650282244096
//   },
//   {
//     id: 7,
//     emotion: 1,
//     content: '오늘의 일기 6번',
//     date: 1750282244097
//   }
// ];
console.log(new Date().getTime());

function App() {
  //   //1. 아래 주석
  //   // const [data, dispatch] = useReducer(reducer, dummyData); //data 기본 state는 빈배열

  //   useEffect(() => {
  //     axios.get('http://218.48.14.96/diaries/').then((response) => {
  //       console.log('===============================');
  //       console.log(response);
  //     });
  //   }, []);

  // 1.아래 주석 해제
  //  api(이거는 주석문만 풀어서 사용)
  const [data, dispatch] = useReducer(reducer, []); //data 기본 state는 빈배열

  // 2. 로컬 스토리지
  //api 서버 통신 할시 데이터를 담아서 초기 값으로 설정한다. 마운트시에 랜더링시에
  // useEffect(()=>{
  //   //
  //   const localData = localStorage.getItem("diary")
  //   if(localData){
  //     const diaryList = JSON.parse(localData).sort((a,b)=> parseInt(b.id) - parseInt(a.id))
  //     data.current = parseInt(diaryList[0].id +1)

  //     dispatch({type:"INIT",data:diaryList})
  //   }
  // },[])

  //2. axios로 데이터 넣기
  //axios 코드
  useEffect(() => {
    axios
      .get('http://211.202.74.84/api/diaries/')
      .then((response) => {
        console.log(response.data);
        console.log('===============================');
        if (response) {
          const diaryList = response.data.sort(
            (a, b) => parseInt(b.id) - parseInt(a.id)
          );
          data.current = parseInt(diaryList[0].id + 1);

          dispatch({ type: 'INIT', data: diaryList });
        }
      })
      .catch((err) => console.log(err));
  }, []);

  // 3. 아래 주석 해제 하고 기본값 6인 useRef 줄 삭제
  const dataId = useRef(0);
  // const dataId = useRef(6);

  //CREATE
  const onCreate = (date, content, emotion) => {
    dispatch({
      type: 'CREATE',
      data: {
        id: dataId.current,
        date: new Date(date).getTime(),
        content,
        emotion
      }
    });
    axios
      .post('http://211.202.74.84/api/diaries/', {
        date: new Date(date).getTime(),
        content: content,
        emotion: emotion
      })
      .then((res) => console.log(res.data))
      .catch((err) => console.log(err));

    dataId.current += 1;
  };
  //REMOVE
  const onRemove = (targetId) => {
    dispatch({ type: 'REMOVE', targetId });
    axios.delete(`http://211.202.74.84/api/diaries/${targetId}/`);
  };
  //EDIT
  const onEdit = (targetId, date, content, emotion) => {
    dispatch({
      type: 'EDIT',
      data: {
        id: targetId,
        date: new Date(date).getTime(),
        content,
        emotion
      }
    });
    axios.patch(`http://211.202.74.84/api/diaries/${targetId}/`, {
      date: date,
      content: content,
      emotion: emotion
    });
  };

  return (
    <DiaryStateContext.Provider value={data}>
      <DiaryDispatchContext.Provider
        value={{
          onCreate,
          onEdit,
          onRemove
        }}
      >
        <BrowserRouter>
          <div className='App'>
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/new' element={<New />} />
              <Route path='/edit/:id' element={<Edit />} />
              <Route path='/diary/:id' element={<Diary />} />
            </Routes>
          </div>
        </BrowserRouter>
      </DiaryDispatchContext.Provider>
    </DiaryStateContext.Provider>
  );
}

export default App;
