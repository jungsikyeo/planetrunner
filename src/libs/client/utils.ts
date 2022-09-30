import { message } from 'antd';
import { RcFile } from 'antd/lib/upload';
import { NFTStorage } from 'nft.storage';

export function cls(...classnames: string[]) {
  return classnames.join(' ');
}

export const getBase64 = (file: RcFile | undefined) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    if (file) {
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    }
  });

export const beforeUpload = (fileType: string, fileSize: number) => {
  const isJpgOrPng =
    fileType === 'image/jpeg' ||
    fileType === 'image/png' ||
    fileType === 'image/gif' ||
    fileType === 'image/svg+xml' ||
    fileType === 'video/mp4' ||
    fileType === 'video/webm' ||
    fileType === 'audio/mp3' ||
    fileType === 'audio/wav' ||
    fileType === 'video/ogg' ||
    fileType === 'model/gltf-binary' ||
    fileType === 'model/gltf+json';
  if (!isJpgOrPng) {
    message.error('This file type cannot be uploaded!');
  }
  const isLt100M = fileSize / 1024 / 1024 < 100;
  if (!isLt100M) {
    message.error('Image must smaller than 100MB!');
  }
  return isJpgOrPng && isLt100M;
};

const NFT_STORAGE_TOKEN: string =
  process.env.NEXT_PUBLIC_NFT_STORAGE_TOKEN || '';
const client = new NFTStorage({ token: NFT_STORAGE_TOKEN });
export const uploadStore = async (storeData: any) => {
  return await client.store({
    ...storeData
  });
};

export const extractMetadataUrl = (url: string) => {
  return url ? `https://ipfs.io/ipfs/${url.split('//')[1]}` : '';
};

export const shortAddress = (address: string) => {
  return address?.length > 0
    ? `${address.substring(0, 6)} . . . ${address.substring(
        address.length - 4,
        address.length
      )}`
    : '';
};

export const longAddress = (address: string) => {
  return address?.length > 0
    ? `${address.substring(0, 8)} . . . ${address.substring(
        address.length - 8,
        address.length
      )}`
    : '';
};

export const EMPTY_ADDRESS = '0x0000000000000000000000000000000000000000';
