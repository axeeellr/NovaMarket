import CryptoJS from 'crypto-js';

// Define tu clave de cifrado secreta
const secretKey = '1001';

// Función para cifrar datos
export function encryptData(data) {
    // Cifra los datos utilizando AES y la clave secreta
    return CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
}

// Función para descifrar datos
export function decryptData(encryptedData) {
    // Descifra los datos utilizando AES y la clave secreta
    const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedData);
}
