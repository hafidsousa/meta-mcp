# Facebook Marketing MCP Server - Technical Context

## Technologies Used
1. **Node.js**: Runtime environment (v18 or higher)
2. **TypeScript**: Programming language
3. **Facebook Graph API**: Direct API integration with Facebook API v22.0
4. **Cursor IDE**: Development environment
5. **MCP Framework**: Cursor IDE integration framework

## Development Setup
1. **Node.js Environment**
   - Version: 18 or higher
   - Package Manager: npm
   - TypeScript Support

2. **Dependencies**
   - dotenv: ^16.0.0
   - @types/node: ^20.0.0
   - typescript: ^5.0.0
   - eslint: ^8.0.0

3. **Development Tools**
   - TypeScript compiler
   - ESLint for code linting
   - ts-node for development
   - npm scripts for build and test

## Documentation

1. **README.md**
   - Main documentation for MCP clients
   - Installation instructions
   - Configuration examples
   - Usage examples

2. **DEVELOPER.md**
   - Detailed documentation for developers
   - Project structure overview
   - Local development setup
   - Testing procedures
   - Publishing instructions
   - Library architecture details
   - Contribution guidelines

## Technical Constraints
1. **API Limitations**
   - Facebook Graph API rate limits
   - API version compatibility (v22.0)
   - Authentication requirements

2. **Environment Requirements**
   - Node.js version
   - Facebook API credentials
   - Cursor IDE compatibility

3. **Security Constraints**
   - Secure credential management
   - API token handling
   - Minimal required credentials

## Dependencies
```json
{
  "dependencies": {
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
   - FB_ACCESS_TOKEN (required)
   - FB_AD_ACCOUNT_ID (required)
   - FB_APP_ID (optional with MCP tools)
   - FB_APP_SECRET (optional with MCP tools)

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
   - Ad account discovery

2. **Cursor IDE MCP**
   - Command interface
   - Response handling
   - Error management
   - Configuration integration
   - Ad account management tools

## MCP Tools
1. **Ad Account Management**
   - List available ad accounts
   - Get owned ad accounts
   - Get client ad accounts

2. **Command-line Utilities**
   - list-accounts: Tool to view available ad accounts

3. **Utility Functions**
   - fetchAdAccounts: Get ad accounts for a user
   - extractAdAccountId: Clean ad account ID format 