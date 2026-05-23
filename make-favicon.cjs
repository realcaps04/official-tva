const Jimp = require('jimp');
const path = 'C:\\Users\\ASUS\\.gemini\\antigravity\\brain\\923318b3-ce31-4c90-9a27-a30519639f36\\media__1779564526232.png';
const outPath = 'c:\\Users\\ASUS\\OneDrive\\Documents(1)\\coding\\TVA\\public\\favicon.png';

Jimp.read(path).then(image => {
  image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
    const r = this.bitmap.data[idx + 0];
    const g = this.bitmap.data[idx + 1];
    const b = this.bitmap.data[idx + 2];
    
    // Convert luminance to alpha, then color it red
    // luminance formula: 0.299*R + 0.587*G + 0.114*B
    const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
    
    this.bitmap.data[idx + 0] = 230; // red
    this.bitmap.data[idx + 1] = 57;  // green
    this.bitmap.data[idx + 2] = 70;  // blue
    this.bitmap.data[idx + 3] = luminance; // alpha based on brightness
  });
  image.write(outPath);
  console.log('Favicon created successfully');
}).catch(err => {
  console.error(err);
});
