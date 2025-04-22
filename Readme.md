# Compression Project

This project implements RLE (Run-Length Encoding) and LZ77 compression algorithms in both Rust and JavaScript.
## Docker Installation

### Pull the Docker Image either the rust compressor or the java script(js) compressor

```bash
docker pull ghcr.io/t-desmond/compression-cli-tool/rust-compressor:latest

```

```bash
docker pull ghcr.io/t-desmond/compression-cli-tool/js-compressor:latest
```

### Run the Container

```bash
# Run JavaScript version
docker run -v $(pwd):/data ghcr.io/micheal-ndoh/rust-compressor:latest 
```

```bash
# Run Rust version
docker run -v $(pwd):/data ghcr.io/micheal-ndoh/js-compressor:latest
```

### Docker Usage Examples

#### Compressing Files

```bash
# Compress a single file using RLE (JavaScript version)
docker run --rm -v "$(pwd)":/data ghcr.io/t-desmond/compression-cli-tool/js-compressor:latest \
    --command compress \
    --input-file /data/js-compressor/data/test.txt \
    --algorithm rle \
    --output-file /data/output.rle
```

```bash
# Compress a single file using LZ77 (Rust version)
docker run --rm -v "$(pwd)":/data ghcr.io/t-desmond/compression-cli-tool/rust-compressor:latest \
    --command compress \
    --input-file /data/rust-compressor/data/test.txt \
    --algorithm lz \
    --output-file /data/output.lz
```

#### Decompressing Files

```bash
# Decompress a single file (JavaScript version)
docker run --rm -v "$(pwd)":/data ghcr.io/t-desmond/compression-cli-tool/js-compressor:latest \
    --command decompress \
    --input-file /data/js-compressor/data/test.rle \
    --algorithm lz \
    --output-file /data/test.out
```

```bash
# Decompress a single file (Rust version)
docker run --rm -v "$(pwd)":/data ghcr.io/t-desmond/compression-cli-tool/js-compressor:latest \
    --command compress \
    --input-file /data/js-compressor/data/test.txt \
    --algorithm lz \
    --output-file /data/test.out
```

## Usage

### JavaScript Compressor

#### Command Line Usage

```bash
# Compress a file using RLE
node index.js --command compress --input input.txt --output compressed.rle --algorithm rle
```

```bash
# Compress a file using LZ77
node index.js --command compress --input input.txt --output compressed.lz --algorithm lz
```

```bash
# Decompress a file
node index.js --command decompress --input compressed.rle --output decompressed.txt --algorithm rle
```

### Rust Compressor

#### Command Line Usage

```bash
# Compress using LZ77 short format
cargo run --release -- --c compress -i compressed/lz/Cargo.lock -a lz -o compressed/lz/Cargo.lock.lz

# Compress using LZ77 
cargo run --release -- --command compress --input-file compressed/lz/Cargo.lock --algorithm lz -o compressed/lz/Cargo.lock.lz

# Decompress a file short format
cargo run --release -c decompress -i output.rle -o decompressed.txt -a rle
```

## References

- [RLE Documentation](https://hydrolix.io/blog/run-length-encoding/)
- [LZ77 Documentation](https://medium.com/@vincentcorbee/lz77-compression-in-javascript-cd2583d2a8bd)

## Benchmarking

### Running Benchmarks

From the root of the project
```bash
chmod +x benchmark.sh

./benchmark.sh
```

A `benchmark_report.md` file is created in which the results of the benchmark can be seen