# Facebook Marketing MCP Server - Technical Context

## Technologies Used
1. **Node.js**: Runtime environment (v18 or higher)
2. **TypeScript**: Programming language
3. **Facebook Marketing API**: Advertising platform integration
4. **Cursor IDE**: Development environment
5. **MCP Framework**: Cursor IDE integration framework

## Development Setup
1. **Node.js Environment**
   - Version: 18 or higher
   - Package Manager: npm
   - TypeScript Support

2. **Dependencies**
   - facebook-nodejs-business-sdk: ^18.0.0
   - dotenv: ^16.0.0
   - @types/node: ^20.0.0
   - typescript: ^5.0.0
   - eslint: ^8.0.0

3. **Development Tools**
   - TypeScript compiler
   - ESLint for code linting
   - ts-node for development
   - npm scripts for build and test

## Technical Constraints
1. **API Limitations**
   - Facebook Marketing API rate limits
   - API version compatibility
   - Authentication requirements

2. **Environment Requirements**
   - Node.js version
   - Facebook API credentials
   - Cursor IDE version

3. **Security Constraints**
   - Secure credential management
   - API token handling
   - Environment variable usage

## Dependencies
```json
{
  "dependencies": {
    "facebook-nodejs-business-sdk": "^18.0.0",
    "dotenv": "^16.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@typescript-eslint/eslint-plugin": "^7.0.0",
    "@typescript-eslint/parser": "^7.0.0",
    "eslint": "^8.0.0",
    "typescript": "^5.0.0",
    "ts-node": "^10.9.0"
  }
}
```

## Build Process
1. TypeScript compilation
2. ESLint validation
3. Package preparation
4. Distribution build

## Configuration Requirements
1. **Environment Variables**
   - FACEBOOK_ACCESS_TOKEN
   - FACEBOOK_AD_ACCOUNT_ID

2. **Cursor IDE Configuration**
   - MCP server registration
   - Command configuration
   - Transport settings

## API Integration
1. **Facebook Marketing API**
   - Authentication
   - Campaign management
   - Ad set operations
   - Ad creation
   - Analytics retrieval

2. **Cursor IDE MCP**
   - Command interface
   - Response handling
   - Error management
   - Configuration integration 