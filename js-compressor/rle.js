function compress_rle(data) {

  let compressRleString = "";
  let dataLength = data.length;
  let i = 0;

  while(i < dataLength) {

    let counter = 1;

    while (i + 1 < dataLength && data[i] === data[i + 1]) {
      counter++;
      i++
    }
    compressRleString += `${counter}${data[i]}`;
    i++
  }
  return compressRleString;
}

console.log(compress_rle("this is a string"));