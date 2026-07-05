import React, { useState } from 'react';
import { captureAndDownload } from '../../utils/shareImage';
import './ShareButton.css';

interface ShareButtonProps {
  targetRef: React.RefObject<HTMLDivElement | null>;
  fileName?: string;
  onError?: (msg: string) => void;
}

const ShareButton: React.FC<ShareButtonProps> = ({ targetRef, fileName, onError }) => {
  const [loading, setLoading] = useState(false);

  const handleShare = async () => {
    if (!targetRef.current || loading) return;
    setLoading(true);
    try {
      await captureAndDownload(
        targetRef.current,
        fileName || `周易算卦_${Date.now()}.png`
      );
    } catch (e) {
      onError?.(e instanceof Error ? e.message : '图片生成失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className="btn-secondary share-button"
      onClick={handleShare}
      disabled={loading}
    >
      {loading ? '生成中...' : '🖼️ 保存图片'}
    </button>
  );
};

export default ShareButton;
