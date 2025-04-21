use std::{error::Error, fs, path::PathBuf, str::FromStr};
use structopt::StructOpt;

#[derive(StructOpt)]
struct Args {
    #[structopt(short, long)]
    command: Command,
    #[structopt(short = "-in", long, parse(from_os_str))]
    input_file: PathBuf,
    #[structopt(short = "-out", long, parse(from_os_str))]
    output_file: Option<PathBuf>,
    #[structopt(short = "-a", long)]
    algorithm: Algorithm,
}

enum Command {
    Compress,
    Decompress,
}

enum Algorithm {
    Lz,
    Rle,
}

impl FromStr for Algorithm {
    type Err = String;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        match s.to_lowercase().as_str() {
            "lz" => Ok(Algorithm::Lz),
            "rle" => Ok(Algorithm::Rle),
            _ => Err(format!("Unsupported algorithm: {}", s)),
        }
    }
}

impl FromStr for Command {
    type Err = String;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        match s.to_lowercase().as_str() {
            "compress" => Ok(Command::Compress),
            "decompress" => Ok(Command::Decompress),
            _ => Err(format!("Unsupported command: {}", s)),
        }
    }
}
fn main() -> Result<(), Box<dyn Error>> {
    let arguments = Args::from_args();

    let data = fs::read(&arguments.input_file)?;

    let output_data = match (&arguments.command, &arguments.algorithm) {
        (Command::Compress, Algorithm::Lz) => lz::compress(&data),
        (Command::Decompress, Algorithm::Lz) => lz::decompress(&data),
        (Command::Compress, Algorithm::Rle) => rle::compress(&data),
        (Command::Decompress, Algorithm::Rle) => rle::decompress(&data),
    };

    let output_file = match &arguments.output_file {
        Some(file) => file.clone(),
        None => {
            let file_name = arguments.input_file.file_name().unwrap();
            let mut new_file_name = file_name.to_os_string();

            
            match (&arguments.command, &arguments.algorithm) {
                (Command::Compress, Algorithm::Lz) => new_file_name.push(".lz"),
                (Command::Decompress, Algorithm::Lz) => new_file_name.push(".out"),
                (Command::Compress, Algorithm::Rle) => new_file_name.push(".rle"),
                (Command::Decompress, Algorithm::Rle) => new_file_name.push(".out"),
            }

            let mut output_file = arguments.input_file.clone();
            output_file.set_file_name(new_file_name);
            output_file
        }
    };

    fs::write(output_file, output_data)?;
    Ok(())
}

mod lz;
mod rle;
