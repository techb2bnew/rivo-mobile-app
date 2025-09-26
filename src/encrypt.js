
import CryptoJS from 'crypto-js';
import { NEXT_PUBLIC_ENCRYPTION_SALT } from './constants/Constants';

const PUBLIC_SALT = NEXT_PUBLIC_ENCRYPTION_SALT || 'default-salt-change-me';

/**
 * Encrypts text using AES encryption
 *
 * @param {string} text - The text to encrypt
 * @returns {string} - Encrypted string
 */
export function encrypt(text) {
  if (!text) {
    throw new Error('Text to encrypt cannot be empty');
  }

  try {
    const encrypted = CryptoJS.AES.encrypt(text, PUBLIC_SALT).toString();
    return encrypted;
  } catch (error) {
    console.error('Encryption error:', error.message);
    throw new Error(`Failed to encrypt: ${error.message}`);
  }
}