import './App.css';
import React, { useReducer, useRef } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Home from './pages/Home';
import New from './pages/New';
import Edit from './pages/Edit';
import Diary from './pages/Diary';

import { type } from '@testing-library/user-event/dist/type';

const reducer = (state, action) => {
  let newState = [];
  switch ((action, type)) {
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
      //id 제외하고 다 바꿈
      newState = state.map((it) =>
        it.id === action.data.id ? { ...action.state } : it
      );
      break;
    }
    default:
      return state;
  }
  return newState;
};
export const DiaryStateContext = React.createContext();
export const DiaryDispatchContext = React.createContext();
const dummyData = [
  {
    id: 1,
    emotion: 1,
    content: '오늘의 일기 1번',
    date: 1650282244092
  },
  {
    id: 2,
    emotion: 2,
    content: '오늘의 일기 2번',
    date: 1650282244093
  },
  {
    id: 3,
    emotion: 4,
    content: '오늘의 일기 3번',
    date: 1650282244094
  },
  {
    id: 4,
    emotion: 3,
    content: '오늘의 일기 4번',
    date: 1650282244095
  },
  {
    id: 5,
    emotion: 5,
    content: '오늘의 일기 5번',
    date: 1650282244096
  },
  {
    id: 7,
    emotion: 1,
    content: '오늘의 일기 6번',
    date: 1750282244097
  }
];
console.log(new Date().getTime());

function App() {
  const [data, dispatch] = useReducer(reducer, dummyData); //data 기본 state는 빈배열
  const dataId = useRef(0);

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
    dataId.current += 1;
  };
  //REMOVE
  const onRemove = (targetId) => {
    dispatch({ type: 'REMOVE', targetId });
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
              <Route path='/edit' element={<Edit />} />
              <Route path='/diary:id' element={<Diary />} />
            </Routes>
          </div>
        </BrowserRouter>
      </DiaryDispatchContext.Provider>
    </DiaryStateContext.Provider>
  );
}

export default App;
