import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Add or modify rules here to ignore specific errors/warnings
      "@typescript-eslint/no-explicit-any": "off", // Allow usage of 'any' type
      "@typescript-eslint/no-unused-vars": "off", // Ignore unused variable warnings
      "react-hooks/exhaustive-deps": "off",       // Ignore missing dependency warnings in useEffect
      "@next/next/no-img-element": "off",         // Allow usage of <img> instead of <Image>
      "@typescript-eslint/no-empty-object-type": "off",
    },
  },
];

export default eslintConfig;
