import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

export const createThumbnail = async (imagePath) => {
  const thumbnailPath = path.join('uploads', 'thumbs', path.basename(imagePath));
  
  await sharp(imagePath)
    .resize(200, 200)
    .toFile(thumbnailPath);

  return thumbnailPath;
};
