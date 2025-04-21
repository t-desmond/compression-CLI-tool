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
            let input_file_name = arguments.input_file.file_name().unwrap();
            let mut output_file_name = input_file_name.to_os_string();

            let action_dir = match arguments.command {
                Command::Compress => "compressed",
                Command::Decompress => "decompressed",
            };

            let algo_str = match arguments.algorithm {
                Algorithm::Lz => "lz",
                Algorithm::Rle => "rle",
            };

            match (&arguments.command, &arguments.algorithm) {
                (Command::Compress, Algorithm::Lz) => output_file_name.push(".lz"),
                (Command::Decompress, Algorithm::Lz) => output_file_name.push(".out"),
                (Command::Compress, Algorithm::Rle) => output_file_name.push(".rle"),
                (Command::Decompress, Algorithm::Rle) => output_file_name.push(".out"),
            }

            let mut output_path = PathBuf::from(action_dir);
            output_path.push(algo_str);
            fs::create_dir_all(&output_path)?;
            output_path.push(output_file_name);
            output_path
        }
    };

    fs::write(output_file, output_data)?;
    Ok(())
}

mod lz;
mod rle;
