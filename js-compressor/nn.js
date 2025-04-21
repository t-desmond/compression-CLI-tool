function compress(data) {
  const searchBufferSize = 10;
  const lookaheadBufferSize = 9;
  let codingPosition = 0;
  let compressed = [];

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
      compressed.push(0x01, offset, length);
      codingPosition += length;
    } else {
      compressed.push(0x00, data.charCodeAt(codingPosition));
      codingPosition++;
    }
  }

  return compressed;
}

function decompress(compressed) {
  let decompressed = [];
  let i = 0;

  while (i < compressed.length) {
    const flag = compressed[i];
    if (flag === 0x00) {
      decompressed.push(String.fromCharCode(compressed[i + 1]));
      i += 2;
    } else if (flag === 0x01) {
      const offset = compressed[i + 1];
      const length = compressed[i + 2];
      const start = decompressed.length - offset;
      for (let j = 0; j < length; j++) {
        decompressed.push(decompressed[start + j]);
      }
      i += 3;
    }
  }

  return decompressed.join('');
}

const input = "abcbbcbaaaaaa";
const compressed = compress(input);
const decompressed = decompress(compressed);

console.log("Compressed:", compressed);
console.log("Decompressed:", decompressed);
