import fs from "fs";
import crypto from "crypto";

export const generateSecurityCredential = (password) => {
  const cert = fs.readFileSync("certs/production.cer");
  return crypto.publicEncrypt(cert, Buffer.from(password)).toString("base64");
};

