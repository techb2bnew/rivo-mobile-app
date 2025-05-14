// /**
//  * Client-safe crypto utility for Next.js
//  * This file provides encryption functions for client-side use
//  */
 
// import crypto from 'crypto-js';
// import { NEXT_PUBLIC_ENCRYPTION_SALT } from './constants/Constants';
 
// // Client-safe encryption with a derived key system
// // We use NEXT_PUBLIC_ prefix so this is available on client side
// const PUBLIC_SALT = NEXT_PUBLIC_ENCRYPTION_SALT || 'default-salt-change-me';
 
// /**
//  * Encrypts text using AES encryption (client-safe version)
//  *
//  * @param {string} text - The text to encrypt
//  * @returns {string} - Encrypted string
//  */
// export function encrypt(text) {
//    if (!text) throw new Error("Text to encrypt cannot be empty");

//   if (typeof window === 'undefined') {
//     throw new Error("Encryption must run on client side only");
//   }
//   try {
//     // Using crypto-js for client-side encryption
//     const encrypted = crypto.AES.encrypt(text, PUBLIC_SALT).toString();
//     return encrypted;
//   } catch (error) {
//     console.error("Encryption error:", error.message);
//     throw new Error(`Failed to encrypt: ${error.message}`);
//   }
// }
 

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