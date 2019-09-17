# Create-War Tool

Tool to create a .war File from commandline.

## Installation

Run `npm install -D git+https://github.com/kaisnb/create-war.git` to install the tool directly from github.

## Run

To run the tool call `create-war config="path\to\config.json"`. The command `create-war` is availabe inside npm scripts.

## Configuration

These are all possible configration parameters. They are all required and have no defaults.

```json
{
  "OUT_PATH": "dist/application.war", 
  "INPUT_PATH": "dist/application",
  "DISPLAY_NAME": "Display Name",
  "CONTEXT_ROOT": "/application"
}
```
-   **OUT_PATH** — Output path where the .war is placed.

-   **INPUT_PATH** — Input path to the folder containing your build.

-   **DISPLAY_NAME** — Content of display-name node inside web.xml.

-   **CONTEXT_ROOT** — Includes a powerful search engine ([lunr.js]) for easily finding what you're looking for.

## License

Everything in this repository is [licensed under the MIT License][license] unless otherwise specified.

Copyright (c) 2019 Kai Schönberger

[license]: https://github.com/kaisnb/create-war/blob/master/LICENSE