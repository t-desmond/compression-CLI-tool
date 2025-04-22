#!/bin/bash

# Define input and output file paths
INPUT_FILE="test.txt"

# JavaScript paths
COMPRESSED_FILE_JS_RLE="js-compressor/compressed/test.rle"
DECOMPRESSED_FILE_JS_RLE="js-compressor/decompressed/test_rle.out"
COMPRESSED_FILE_JS_LZ="js-compressor/compressed/test.lz"
DECOMPRESSED_FILE_JS_LZ="js-compressor/decompressed/test_lz.out"

# Rust paths
COMPRESSED_FILE_RUST_RLE="rust-compressor/compressed/test.rle"
DECOMPRESSED_FILE_RUST_RLE="rust-compressor/decompressed/test_rle.out"
COMPRESSED_FILE_RUST_LZ="rust-compressor/compressed/test.lz"
DECOMPRESSED_FILE_RUST_LZ="rust-compressor/decompressed/test_lz.out"

# File path for reporting
REPORT_FILE="benchmark_report.md"

# Create the report file and start writing
echo "# Benchmarking Report" >$REPORT_FILE
echo "Benchmarking results for compression and decompression using JavaScript and Rust (RLE and LZ Algorithms)." >>$REPORT_FILE
echo "" >>$REPORT_FILE
echo "| Implementation | Command          | Compression Time (s) | Decompression Time (s) | Compressed Size (bytes) | Decompressed Size (bytes) |" >>$REPORT_FILE
echo "| -------------- | ---------------- | -------------------- | ----------------------- | ------------------------ | ------------------------- |" >>$REPORT_FILE

benchmark_js() {
  local algo=$1
  local compressed_file_var="COMPRESSED_FILE_JS_${algo^^}"
  local decompressed_file_var="DECOMPRESSED_FILE_JS_${algo^^}"

  echo "Benchmarking JavaScript Compression with ${algo^^}..."

  mkdir -p js-compressor/compressed js-compressor/decompressed

  START_TIME=$(date +%s)
  docker run --rm \
    -v "$(pwd)/js-compressor/data:/app/data" \
    -v "$(pwd)/js-compressor/compressed:/app/compressed" \
    ghcr.io/t-desmond/compression-cli-tool/js-compressor:latest \
    node index.js \
      --command compress \
      --input data/$INPUT_FILE \
      --algorithm $algo \
      --output compressed/$(basename "${!compressed_file_var}")
  END_TIME=$(date +%s)
  COMPRESS_TIME=$((END_TIME - START_TIME))

  START_TIME=$(date +%s)
  docker run --rm \
    -v "$(pwd)/js-compressor/compressed:/app/compressed" \
    -v "$(pwd)/js-compressor/decompressed:/app/decompressed" \
    ghcr.io/t-desmond/compression-cli-tool/js-compressor:latest \
    node index.js \
      --command decompress \
      --input compressed/$(basename "${!compressed_file_var}") \
      --algorithm $algo \
      --output decompressed/$(basename "${!decompressed_file_var}")
  END_TIME=$(date +%s)
  DECOMPRESS_TIME=$((END_TIME - START_TIME))

  COMPRESSED_SIZE=$(wc -c <"${!compressed_file_var}")
  DECOMPRESSED_SIZE=$(wc -c <"${!decompressed_file_var}")

  echo "| JavaScript | Compress (${algo^^}) | $COMPRESS_TIME | $DECOMPRESS_TIME | $COMPRESSED_SIZE | $DECOMPRESSED_SIZE |" >>"$REPORT_FILE"
}

benchmark_rust() {
  local algo=$1
  local compressed_file_var="COMPRESSED_FILE_RUST_${algo^^}"
  local decompressed_file_var="DECOMPRESSED_FILE_RUST_${algo^^}"

  echo "Benchmarking Rust Compression with ${algo^^}..."

  mkdir -p rust-compressor/compressed rust-compressor/decompressed

  START_TIME=$(date +%s)
  docker run --rm -v "$(pwd)":/data ghcr.io/t-desmond/compression-cli-tool/rust-compressor:latest \
    --command compress \
    --input-file /data/js-compressor/data/$INPUT_FILE \
    --algorithm $algo \
    --output-file /data/${!compressed_file_var}
  END_TIME=$(date +%s)
  COMPRESS_TIME=$((END_TIME - START_TIME))

  START_TIME=$(date +%s)
  docker run --rm -v "$(pwd)":/data ghcr.io/t-desmond/compression-cli-tool/rust-compressor:latest \
    --command decompress \
    --input-file /data/${!compressed_file_var} \
    --algorithm $algo \
    --output-file /data/${!decompressed_file_var}
  END_TIME=$(date +%s)
  DECOMPRESS_TIME=$((END_TIME - START_TIME))

  COMPRESSED_SIZE=$(wc -c <"${!compressed_file_var}")
  DECOMPRESSED_SIZE=$(wc -c <"${!decompressed_file_var}")

  echo "| Rust       | Compress (${algo^^}) | $COMPRESS_TIME | $DECOMPRESS_TIME | $COMPRESSED_SIZE | $DECOMPRESSED_SIZE |" >>"$REPORT_FILE"
}

# Run benchmarks
benchmark_js rle
benchmark_rust rle
benchmark_js lz
benchmark_rust lz
