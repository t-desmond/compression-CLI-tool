function compress(data) {

  if (!Buffer.isBuffer(data)) {
    throw new Error("Input must be a Buffer");
  }

  let compressRleString = [];
  let dataLength = data.length;
  let i = 0;

  while (i < dataLength) {
    let counter = 1;

    while (
      i + counter < dataLength &&
      data[i] === data[i + counter] &&
      counter < 255
    ) {
      counter++;
    }
    compressRleString.push(counter);
    compressRleString.push(data[i]);
    i += counter;
  }
  return Buffer.from(compressRleString);
}

function decompress(data) {
  
  if (!Buffer.isBuffer(data)) {
    throw new Error("Input must be a Buffer");
  }

  let decompressRleString = [];
  for (let i = 0; i < data.length; i += 2) {
    const tempCounter = data[i];
    const tempBuffer = data[i + 1];

    for (let j = 0; j < tempCounter; j++) {
      decompressRleString.push(tempBuffer);
    }
  }
  return Buffer.from(decompressRleString);
}

module.exports = { compress, decompress };

