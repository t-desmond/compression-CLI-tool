pub fn compress(data: &[u8]) -> Vec<u8> {
    use std::cmp::{max, min};

    const SEARCH_BUFFER_SIZE: usize = 20;
    const LOOKAHEAD_BUFFER_SIZE: usize = 15;
    let mut coding_position: usize = 0;
    let mut compressed: Vec<u8> = Vec::new();

    while coding_position < data.len() {
        let mut offset: usize = 0;
        let mut length: usize = 0;

        let search_buffer_start: usize = max(0, coding_position.saturating_sub(SEARCH_BUFFER_SIZE));
        let search_buffer = &data[search_buffer_start..coding_position];

        let lookahead_buffer_end = min(data.len(), coding_position + LOOKAHEAD_BUFFER_SIZE);
        let lookahead_buffer = &data[coding_position..lookahead_buffer_end];

        for i in (1..=lookahead_buffer.len()).rev() {
            let potential_match = &lookahead_buffer[0..i];

            if let Some(index) = search_buffer
                .windows(potential_match.len())
                .rposition(|window| window == potential_match)
            {
                offset = coding_position - (search_buffer_start + index);
                length = potential_match.len();
                break;
            }
        }

        if length > 0 {
            compressed.push(0x01);
            compressed.push(offset as u8);
            compressed.push(length as u8);
            coding_position += length;
        } else {
            compressed.push(0x00);
            compressed.push(data[coding_position]);
            coding_position += 1;
        }
    }
    compressed
}

pub fn decompress(data: &[u8]) -> Vec<u8> {
    let mut decompressed: Vec<u8> = Vec::new();
    let mut i = 0;

    while i < data.len() {
        let flag = data[i];

        if flag == 0x00 {
            decompressed.push(data[i + 1]);
            i += 2;
        } else {
            let offset = data[i + 1] as usize;
            let length = data[i + 2] as usize;
            let start = decompressed.len() - offset;
            for j in 0..length {
                decompressed.push(decompressed[start + j]);
            }
            i += 3;
        }
    }
    decompressed
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
