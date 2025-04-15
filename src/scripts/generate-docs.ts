#!/usr/bin/env node

/**
 * @fileoverview Script to generate tool documentation from TypeScript types
 * 
 * This script uses the docgen utility to create standardized documentation
 * for the Facebook Marketing API tools based on TypeScript types.
 * 
 * Usage: 
 * - npm run generate-docs            # Outputs to stdout
 * - npm run generate-docs -- --file  # Outputs to docs/tools.json
 */

import { generateAllToolDefinitions } from '../utils/docgen';
import fs from 'fs';
import path from 'path';

// Check for arguments
const writeToFile = process.argv.includes('--file');

// Generate the tool definitions
const tools = generateAllToolDefinitions();

// Pretty-print the JSON
const prettyOutput = JSON.stringify(tools, null, 2);

if (writeToFile) {
  // Create docs directory if it doesn't exist
  const docsDir = path.join(process.cwd(), 'docs');
  if (!fs.existsSync(docsDir)) {
    fs.mkdirSync(docsDir);
  }
  
  // Write to file
  const outputPath = path.join(docsDir, 'tools.json');
  fs.writeFileSync(outputPath, prettyOutput);
  console.log(`Documentation generated successfully at ${outputPath}`);
} else {
  // Output to console
  console.log(prettyOutput);
} 