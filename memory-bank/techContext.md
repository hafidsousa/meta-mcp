# Facebook Marketing MCP Server - Technical Context

## Technologies Used
1. **Node.js**: Runtime environment (v18 or higher)
2. **TypeScript**: Programming language
3. **Facebook Graph API**: Direct API integration with Facebook API v22.0
4. **Cursor IDE**: Development environment
5. **MCP Framework**: Cursor IDE integration framework
6. **@modelcontextprotocol/sdk**: Official MCP SDK for standardized tool integration

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
   - @modelcontextprotocol/sdk: ^0.3.0

3. **Development Tools**
   - TypeScript compiler
   - ESLint for code linting
   - ts-node for development
   - npm scripts for build and test

## Project Structure
1. **Core Files**
   - `src/server.ts`: Main MCP server implementation
   - `src/client.ts`: Facebook Marketing API client
   - `src/types.ts`: Type definitions
   - `src/mcp-utils.ts`: Utility functions for MCP
   - `src/errors.ts`: Error handling utilities
   - `src/config.ts`: Configuration management
   - `src/index.ts`: Main export file

2. **Script Files**
   - `src/scripts/list-accounts.ts`: Utility to list available ad accounts
   - `src/scripts/list-campaigns.ts`: Utility to list campaigns
   - `src/scripts/create-campaign.ts`: Campaign creation script
   - `src/scripts/generate-token-url.ts`: Auth token URL generator
   - `src/scripts/test-mcp.ts`: Test script for MCP server

3. **Build Output**
   - `dist/`: Compiled JavaScript files
   - `dist/types/`: TypeScript declaration files

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
   - MCP SDK compatibility

3. **Security Constraints**
   - Secure credential management
   - API token handling
   - Minimal required credentials

## Dependencies
```json
{
  "dependencies": {
    "dotenv": "^16.0.0",
    "@modelcontextprotocol/sdk": "^0.3.0"
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
   - MCP SDK integration

## MCP Implementation
1. **Server Implementation**
   - Uses official @modelcontextprotocol/sdk
   - Implements ToolingInterface from SDK
   - Standardized tool definition format
   - Robust request & response handling
   - Input validation using JSON Schema

2. **Tool Definition**
   - Structured using SDK's Tool interface
   - Schema-based parameter validation
   - Standardized error responses
   - Consistent metadata handling

3. **Request Handling**
   - Endpoint: /tools/list for discovering available tools
   - Endpoint: /tools/invoke for executing tool calls
   - Structured error handling
   - Input parameter validation

## MCP Tools
1. **Ad Account Management**
   - List available ad accounts
   - Get owned ad accounts
   - Get client ad accounts

2. **Command-line Utilities**
   - list-accounts: Tool to view available ad accounts
   - list-campaigns: Tool to view campaigns
   - generate-token-url: Generate authentication URLs
   - create-campaign: Create test campaigns
   - test-mcp: Test MCP server functionality

3. **Utility Functions**
   - fetchAdAccounts: Get ad accounts for a user
   - extractAdAccountId: Clean ad account ID format 