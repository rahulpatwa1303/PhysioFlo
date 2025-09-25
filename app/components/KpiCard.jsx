"use client";

import { Card, Statistic } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';

const KpiCard = ({ title, value, change, changeType }) => {
  const isIncrease = changeType === 'increase';
  
  return (
    <Card className="shadow-sm h-full">
      <Statistic
        title={title}
        value={value}
        suffix={
          change && (
            <span className={`text-sm ${isIncrease ? 'text-green-600' : 'text-red-600'}`}>
              {isIncrease ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
              {change}
            </span>
          )
        }
        valueStyle={{
          color: '#1677ff',
          fontSize: '24px',
          fontWeight: 'bold'
        }}
      />
    </Card>
  );
};

export default KpiCard;
