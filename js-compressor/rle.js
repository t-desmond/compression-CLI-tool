function compressRle(data) {
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

function decompressRle(data) {
  let i = 0;
  let decompressRleString = "";
  while (i < data.length) {
    let tempCounter =  0;
    let tempBuffer = "";

    while (tempCounter < parseInt(data[i])) {
      tempBuffer += data[i + 1];
      tempCounter++
    }
    decompressRleString += tempBuffer;
    i += 2;
  }
  return decompressRleString;
}
