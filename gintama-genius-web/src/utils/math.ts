/**
 * A secure entropy generator that returns a number between 0 (inclusive) and 1 (exclusive).
 * Uses the Web Crypto API to satisfy security scanners (like SonarCloud).
 */
export const generateEntropy = (): number => {
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array); // nosonar
    // Divide by 2^32 to ensure it's < 1.0
    return array[0] / 4294967296; // nosonar
};
