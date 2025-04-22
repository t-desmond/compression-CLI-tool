#![allow(dead_code)]

pub fn compress(data: &[u8]) -> Vec<u8> {
    let mut compress_rle_string: Vec<u8> = Vec::new();
    let mut i: usize = 0;

    while i < data.len() {
        let mut counter = 1;

        while i + counter < data.len() && data[i] == data[i + counter] && counter < 255 {
            counter += 1;
        }
        compress_rle_string.push(counter as u8);
        compress_rle_string.push(data[i]);
        i += counter;
    }
    compress_rle_string
}

pub fn decompress(data: &[u8]) -> Vec<u8> {
    let mut decompress_rle_string: Vec<u8> = Vec::new();

    let mut i: usize = 0;
    while i < data.len() {
        let temp_counter = data[i];
        let temp_buffer = data[i + 1];

        for _ in 0..temp_counter {
            decompress_rle_string.push(temp_buffer);
        }
        i += 2
    }
    decompress_rle_string
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