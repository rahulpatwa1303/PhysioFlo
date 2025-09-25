"use client";

import { Card, Calendar, Badge } from 'antd';
import { useState } from 'react';
import dayjs from 'dayjs';

// Dummy appointment data
const appointmentData = {
  '2024-01-15': [
    { type: 'success', content: '10:00 AM - John Smith' },
    { type: 'warning', content: '2:00 PM - Emily Johnson' },
  ],
  '2024-01-16': [
    { type: 'success', content: '9:00 AM - Robert Davis' },
    { type: 'error', content: '11:00 AM - Sarah Wilson (Urgent)' },
    { type: 'success', content: '3:00 PM - Michael Brown' },
  ],
  '2024-01-17': [
    { type: 'success', content: '10:30 AM - Lisa Garcia' },
  ],
};

const AppointmentsCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(dayjs());

  const getListData = (value) => {
    const dateKey = value.format('YYYY-MM-DD');
    return appointmentData[dateKey] || [];
  };

  const dateCellRender = (value) => {
    const listData = getListData(value);
    return (
      <ul className="events">
        {listData.map((item, index) => (
          <li key={index}>
            <Badge status={item.type} text={item.content} />
          </li>
        ))}
      </ul>
    );
  };

  const cellRender = (current, info) => {
    if (info.type === 'date') return dateCellRender(current);
    return info.originNode;
  };

  return (
    <Card title="Appointments Calendar" className="shadow-sm">
      <Calendar
        cellRender={cellRender}
        onSelect={setSelectedDate}
        mode="month"
        style={{ height: '400px' }}
      />
    </Card>
  );
};

export default AppointmentsCalendar;
