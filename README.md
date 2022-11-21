<div align="center">
  <a href="https://r-factor.org">
    <img src="https://raw.githubusercontent.com/limesquid/r-factor/master/logo.png" alt="R-Factor logo" />
  </a>

  <h1>R-Factor extension for Visual Studio Code</h1>

  <p>
    <img src="https://img.shields.io/github/package-json/v/limesquid/r-factor-vscode.svg" alt="Version" />
    <a href="https://github.com/limesquid/r-factor-vscode/blob/master/LICENSE">
      <img src="https://img.shields.io/github/license/limesquid/r-factor-vscode" alt="license" />
    </a>
  </p>


  <p>
    <a href="https://r-factor.org">Website</a> • <a href="https://r-factor.org/documentation">Documentation</a>
  </p>

  <hr />

  <p>
    <a href="https://github.com/limesquid/r-factor">R-Factor</a> • <a href="https://github.com/limesquid/r-factor-website">r-factor.org</a>
    <br />
    <a href="https://github.com/limesquid/r-factor-atom">Atom</a> • <a href="https://github.com/limesquid/r-factor-sublime">Sublime Text</a> • <a href="https://github.com/limesquid/r-factor-vscode">Visual Studio Code</a>
  </p>

  <hr />
</div>

## Install

### Stable version

```Shell
wget -c https://github.com/limesquid/r-factor-vscode/archive/refs/tags/1.0.0.zip -O r-factor-vscode.zip
mkdir -p ~/.vscode/extensions
unzip r-factor-vscode.zip -d ~/.vscode/extensions
rm r-factor-vscode.zip
mv ~/.vscode/extensions/r-factor-vscode-1.0.0 ~/.vscode/extensions/r-factor-vscode
cd ~/.vscode/extensions/r-factor-vscode
npm install
```

### Latest (master)

```Shell
wget -c https://github.com/limesquid/r-factor-vscode/archive/refs/heads/master.zip -O r-factor-vscode.zip
mkdir -p ~/.vscode/extensions
unzip r-factor-vscode.zip -d ~/.vscode/extensions
rm r-factor-vscode.zip
mv ~/.vscode/extensions/r-factor-vscode-master ~/.vscode/extensions/r-factor-vscode
cd ~/.vscode/extensions/r-factor-vscode
npm install
```

## Uninstall

```Shell
rm -rf ~/.vscode/extensions/r-factor-vscode
```
