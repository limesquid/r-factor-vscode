const fs = require('fs');
const path = require('path');
const vscode = require('vscode');

exports.writeLicense = (license) => fs.writeFileSync(getLicenseFilePath(), license);

exports.readLicense = (license) => {
  try {
    return fs.readFileSync(getLicenseFilePath(), 'utf-8');
  } catch (error) {
    return null;
  }
};

const getLicenseFilePath = () => {
  const packagePath = vscode.extensions.getExtension('r-factor.r-factor').extensionPath;
  return path.resolve(packagePath, 'user_license');
};
