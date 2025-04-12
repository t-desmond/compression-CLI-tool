function compress(data) {
  let compressRleString = "";
  let dataLength = data.length;
  let i = 0;

  while (i < dataLength) {
    let counter = 1;

    while (i + 1 < dataLength && data[i] === data[i + 1]) {
      counter++;
      i++;
    }
    compressRleString += `${counter}${data[i]}`;
    i++;
  }
  return compressRleString;
}

function decompress(data) {

  if (data.length % 2 !== 0) throw new Error("Invalid RLE data format.");

  let decompressRleString = "";
  for (let i = 0; i < data.length; i += 2) {

    let tempCounter =  parseInt(data[i]);
    tempBuffer = data[i + 1];

    decompressRleString += tempBuffer.repeat(tempCounter)
  }
  return decompressRleString;
}
