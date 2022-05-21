const crypto = require("crypto");
/**
 * Crypto utility functions
 */
module.exports = {
  /**
   * Encrypts a string using a given key
   * @param {string} str The string to encrypt
   * @param {string} key The key to use for encryption
   * @returns {string} The encrypted string
   */
  encrypt: (str, key) => {
    if (typeof key !== "string") {
      throw new Error("Key must be a string");
    }
    if (typeof str !== "string") {
      throw new Error("String must be a string");
    }

    const iv = crypto.randomBytes(16),
      hash = crypto.createHmac("sha256", key),
      cipher = crypto.createCipheriv(
        "aes-256-cbc",
        hash.update(key).digest(),
        iv
      );

    let encrypted = cipher.update(str, "utf8", "hex");
    encrypted += cipher.final("hex");
    return iv.toString("hex") + encrypted;
  },
  /**
   * Decrypts a string using a given key
   * @param {string} str The string to decrypt
   * @param {string} key The key to use for decryption
   * @returns {string} The decrypted string
   */
  decrypt: (str, key) => {
    if (typeof key !== "string") {
      throw new Error("Key must be a string");
    }
    if (typeof str !== "string") {
      throw new Error("String must be a string");
    }
    if (str.length < 32) {
      throw new Error("String must be at least 32 characters long");
    }

    const iv = Buffer.from(str.substring(0, 32), "hex"),
      encrypted = str.substring(32),
      hash = crypto.createHmac("sha256", key),
      decipher = crypto.createDecipheriv(
        "aes-256-cbc",
        hash.update(key).digest(),
        iv
      );

    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  },
};
