const { getDefaultConfig } = require('@expo/metro-config');

const config = getDefaultConfig(__dirname);

// Firebase JS SDK v10+ ships ESM/CJS dual builds. Disabling package exports
// and adding cjs to source extensions avoids the well-known
// "Component auth has not been registered yet" error in Expo + RN.
config.resolver.sourceExts.push('cjs');
config.resolver.unstable_enablePackageExports = false;

module.exports = config;
