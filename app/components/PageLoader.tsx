"use client";
import { useEffect, useState } from 'react';
import { Spin } from 'antd';

interface PageLoaderProps {
  children: React.ReactNode;
  loading?: boolean;
  minLoadingTime?: number;
}

export default function PageLoader({ 
  children, 
  loading = false, 
  minLoadingTime = 500 
}: PageLoaderProps) {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        setShowContent(true);
      }, minLoadingTime);
      
      return () => clearTimeout(timer);
    } else {
      setShowContent(false);
    }
  }, [loading, minLoadingTime]);

  if (loading || !showContent) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 120px)',
        backgroundColor: '#f5f5f5'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 16,
          padding: 32,
          backgroundColor: 'white',
          borderRadius: 12,
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          <Spin size="large" />
          <span style={{ color: '#6C63FF', fontWeight: 500, fontSize: 16 }}>
            Loading page...
          </span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
