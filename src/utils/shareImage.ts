import html2canvas from 'html2canvas';

/**
 * 将指定 DOM 元素截取为图片并下载
 */
export async function captureAndDownload(
  element: HTMLElement,
  fileName = 'zhouyi-result.png'
): Promise<void> {
  try {
    const canvas = await html2canvas(element, {
      backgroundColor: '#1a1a2e',
      scale: 2,
      useCORS: true,
    });

    const link = document.createElement('a');
    link.download = fileName;
    link.href = canvas.toDataURL('image/png');
    link.click();
  } catch (err) {
    console.error('分享图片生成失败:', err);
    throw err;
  }
}
