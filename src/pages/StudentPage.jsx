import React from 'react';
import { Tabs } from 'antd';
import TopNavbar from '../components/TopNavbar';
import MainStudentView from './student/MainStudentView';

const onChange = (key) => {
  console.log(key);
};

const StudentPage = () => (
  <>
    <TopNavbar/>
    <Tabs
      onChange={onChange}
      type="card"
      items={[
        {
          label: 'Becas',
          key: '1',
          children: 'Contenido de la pestaña Becas',
        },
        {
          label: 'Citas',
          key: '2',
          children: 'Contenido de la pestaña Citas',
        },
      ]}
    />
    <MainStudentView/>
  </>
);

export default StudentPage;