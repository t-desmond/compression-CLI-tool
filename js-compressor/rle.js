function compress_rle(data) {
  let compressRleString = "";
  let dataLength = data.length;
  for (i = 0; i < dataLength; i++) {
    let j = i + 1;
    let counter = 1;
    while (i < dataLength && data[i] === data[j]) {
      counter++;
      j++
    }
    compressRleString += `${counter}${data[i]}`;
  }
  return compressRleString;
}

console.log(compress_rle("daata"));
