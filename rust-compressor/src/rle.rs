use std::error::Error;

fn compress(data: &[u8]) -> Result<Vec<u8>, Box<dyn Error>> {
  let mut compress_rle_string: Vec<u8> = Vec::new();
  let mut i: usize =  0;

  while i < data.len() {
    let mut counter = 1;

    while 
      i + counter < data.len() &&
      data[i] == data[i + counter] &&
      counter < 255
     {
      counter += 1;
    }
    compress_rle_string.push(counter as u8);
    compress_rle_string.push(data[i]);
    i += counter;
  }
  Ok(compress_rle_string)
}


#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_rle_roundtrip() {
        let input = b"AAABBBCCCCCDDDDE";
        let compressed = compress(input);
        let decompressed = decompress(&compressed);
        assert_eq!(input.to_vec(), decompressed);
    }
}
