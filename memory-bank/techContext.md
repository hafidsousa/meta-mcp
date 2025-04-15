# Facebook Marketing MCP Server - Technical Context

## Core Technologies
1. **Node.js**: Runtime environment
2. **TypeScript**: Primary programming language
3. **Facebook Marketing API**: Advertising platform API
4. **Model Context Protocol (MCP)**: Framework for tool integration with Cursor IDE
5. **JSON Schema**: Used for input validation
6. **humps**: For reliable case conversion between camelCase and snake_case

## Libraries & Dependencies
1. **dotenv**: Environment variables management
2. **@modelcontextprotocol/sdk**: MCP integration framework
3. **node-fetch**: For API requests
4. **jest**: Testing framework
5. **typescript**: TypeScript compiler
6. **ts-node**: TypeScript execution
7. **express**: Web server for MCP endpoints
8. **cors**: Cross-origin resource sharing
9. **humps**: Case conversion library (camelCase ↔ snake_case)

## Development Environment
1. **Node.js 18+**: Runtime environment
2. **npm**: Package management
3. **TypeScript 5.0+**: Type checking and compilation
4. **VS Code**: Recommended IDE
5. **ESLint**: Code linting
6. **Prettier**: Code formatting
7. **Jest**: Testing framework

## Facebook Marketing API
The project integrates with Facebook's Marketing API v22.0, which provides programmatic access to create and manage ads. Key aspects include:

1. **Authentication**
   - OAuth 2.0 authentication
   - Long-lived access tokens
   - Permissioned access based on app roles

2. **Ad Account Management**
   - Discover available ad accounts
   - Get account details
   - Access spending limits

3. **Campaign Management**
   - Campaign objectives and budgeting
   - Campaign lifecycle management
   - Campaign targeting options
   - Special ad categories handling

4. **Ad Set Management**
   - Audience targeting and demographics
   - Placement options
   - Budget and scheduling
   - Optimization goals

5. **Ad Management**
   - Creative management
   - Ad formats and specifications
   - Tracking and analytics
   - Dynamic creative options

## Project Structure
1. **src/**: Source code
   - **operations/**: Domain-specific operations (campaign, adset, ad, account)
   - **utils/**: Utility functions and helpers
   - **types.ts**: Type definitions
   - **client.ts**: Main client facade
   - **config.ts**: Configuration management
   - **tools.ts**: MCP tool definitions
   - **handlers.ts**: MCP request handlers
   - **server.ts**: MCP server setup

2. **scripts/**: Utility scripts
   - **list-accounts.ts**: List available ad accounts
   - **generate-token-url.ts**: Generate authentication URLs
   - **test-mcp.ts**: Test MCP server functionality

3. **dist/**: Compiled JavaScript output

4. **tests/**: Test files
   - **unit/**: Unit tests
   - **integration/**: Integration tests
   - **mocks/**: Mock data for tests

5. **docs/**: Documentation
   - **api/**: API specifications
   - **facebook/**: Facebook API reference
   - **examples/**: Usage examples

## Data Models
The system works with several key data models that map to Facebook Marketing API entities:

1. **Ad Account**
   - Identifier and name
   - Currency and spending limits
   - Account status
   - Business relationship

2. **Campaign**
   - Objective and strategy
   - Budget and timing
   - Status management
   - Special ad categories
   - Campaign type

3. **Ad Set**
   - Target audience definition
   - Budget allocation
   - Bidding strategy
   - Schedule and pacing
   - Optimization goals

4. **Ad**
   - Creative association
   - Status management
   - Tracking configuration
   - Bidding controls
   - Performance monitoring

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

## Case Conversion
1. **Library**: humps v2.0.1
2. **Purpose**:
   - Convert between camelCase (JS/TS standard) and snake_case (FB API requirement)
   - Handle nested objects and arrays recursively
   - Maintain type safety throughout conversion
3. **Key functions**:
   - `humps.decamelizeKeys()`: Converts camelCase to snake_case
   - `humps.camelizeKeys()`: Converts snake_case to camelCase
4. **Implementation**:
   - Used in all operation modules (campaign.ts, adset.ts, ad.ts)
   - Applied to API request parameters before sending to Facebook
   - Properly handles nested targeting objects

## MCP Tools
1. **Ad Account Management**
   - List available ad accounts
   - Get owned ad accounts
   - Get client ad accounts

2. **Campaign Management**
   - Create campaign
   - Pause campaign
   - Get campaigns
   - Get campaign details

3. **Ad Set Management**
   - Create ad set
   - Pause ad set
   - Get ad sets for campaign
   - Get ad sets for account
   - Get ad set details

4. **Ad Management**
   - Create ad
   - Pause ad
   - Get ads for ad set
   - Get ads for account
   - Get ad details
   - Update ad

5. **Command-line Utilities**
   - list-accounts: Tool to view available ad accounts
   - list-campaigns: Tool to view campaigns
   - generate-token-url: Generate authentication URLs
   - create-campaign: Create test campaigns
   - test-mcp: Test MCP server functionality

6. **Utility Functions**
   - fetchAdAccounts: Get ad accounts for a user
   - extractAdAccountId: Clean ad account ID format 