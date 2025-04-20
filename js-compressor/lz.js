function compress(data) {
  const searchBufferSize = 3;
  const lookaheadBufferSize = 3;
  let codingPosition = 0;
  let compressLzString = [];

  while (codingPosition < data.length) {
    let offset = 0;
    let length = 0;

    const searchBufferStart = Math.max(0, codingPosition - searchBufferSize);
    const searchBuffer = data.slice(searchBufferStart, codingPosition);

    const lookaheadBufferEnd = Math.min(
      data.length,
      codingPosition + lookaheadBufferSize
    );
    const lookaheadBuffer = data.slice(codingPosition, lookaheadBufferEnd);

    for (let i = lookaheadBuffer.length; i > 0; i--) {
      const potentialMatch = lookaheadBuffer.slice(0, i);
      const index = searchBuffer.lastIndexOf(potentialMatch);

      if (index !== -1) {
        offset = codingPosition - (searchBufferStart + index);
        length = potentialMatch.length;
        break;
      }
    }

    if (length > 0) {
      compressLzString.push([
        offset,
        length,
        data[codingPosition + length] || "",
      ]);
      codingPosition += length + 1;
    } else {
      compressLzString.push([0, 0, data[codingPosition]]);
      codingPosition++;
    }
  }

  return compressLzString;
}


function decompress(data) {
  let decompressed = [];

  for (const [distance, length, nextChar] of data) {
    if (length === 0) {
      decompressed.push(nextChar);
    } else {
      const start = decompressed.length - distance;
      for (let i = 0; i < length; i++) {
        decompressed.push(decompressed[start + i]);
      }
      decompressed.push(nextChar);
    }
  }

  return decompressed.toString();
}
