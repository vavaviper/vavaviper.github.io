import sharp from 'sharp';
import fs from 'fs';

// Extract the top-left sprite (256x256px) from player.png
sharp('public/player.png')
  .extract({ left: 0, top: 0, width: 256, height: 256 })
  .resize(256, 256)
  .png()
  .toFile('public/player-icon.png', (err, info) => {
    if (err) {
      console.error('Error extracting favicon:', err);
    } else {
      console.log('Favicon extracted successfully:', info);
    }
  });
