function compress(data) {
  if (!Buffer.isBuffer(data)) {
    data = Buffer.from(data, 'latin1');
  }

  const searchBufferSize = 20;
  const lookaheadBufferSize = 15;
  let codingPosition = 0;
  let compressed = [];

  while (codingPosition < data.length) {
    let offset = 0;
    let length = 0;

    const searchBufferStart = Math.max(0, codingPosition - searchBufferSize);
    const searchBuffer = data.slice(searchBufferStart, codingPosition);
    const lookaheadBufferEnd = Math.min(data.length, codingPosition + lookaheadBufferSize);
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
      compressed.push(0x01, offset, length);
      codingPosition += length;
    } else {
      compressed.push(0x00, data[codingPosition]);
      codingPosition++;
    }
  }

  return Buffer.from(compressed);
}

function decompress(data) {
  if (!Buffer.isBuffer(data)) {
    data = Buffer.from(data);
  }

  let decompressed = [];

  for (let i = 0; i < data.length;) {
    const flag = data[i];

    if (flag === 0x00) {
      decompressed.push(data[i + 1]);
      i += 2;
    } else if (flag === 0x01) {
      const offset = data[i + 1];
      const length = data[i + 2];
      const start = decompressed.length - offset;
      for (let j = 0; j < length; j++) {
        decompressed.push(decompressed[start + j]);
      }
      i += 3;
    } else {
      throw new Error(`Invalid flag: ${flag}`);
    }
  }

  return Buffer.from(decompressed);
}


module.exports = {compress, decompress}