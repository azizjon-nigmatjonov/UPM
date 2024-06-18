import React from 'react';
import './style.scss';
import { useParams } from 'react-router-dom';
import TestPage from './pages/index'
import TestSinglePage from './pages/SinglePage/index';

export default function TestSide() {
  const { testId } = useParams();
  return (
    <div className='TestSide'>
      {testId ? (
        <TestSinglePage />
      ) : (
        <TestPage />
      )}
    </div>
  );
}
