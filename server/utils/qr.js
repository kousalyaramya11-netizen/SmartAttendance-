import QRCode from 'qrcode';

async function generateQrPng(data) {
  return QRCode.toDataURL(data);
}

export { generateQrPng };
