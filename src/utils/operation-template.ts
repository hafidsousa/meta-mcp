/**
 * @fileoverview Operation template for Facebook Marketing API calls
 * Provides higher-order functions to reduce boilerplate in operation files
 */

import * as humps from 'humps';
import { apiRequest, handleApiError } from './api';
import { z } from 'zod';

/**
 * Generic create operation for Facebook entities
 * 
 * @param entityType Entity type name (e.g., 'campaign', 'adset', 'ad')
 * @param schema Zod schema for validation
 * @returns A function that creates the entity
 */
export function createOperation<T, U, V>(
  entityType: string,
  schema: z.ZodType<T>
) {
  return async function(
    baseUrl: string,
    adAccountId: string,
    accessToken: string,
    config: T,
    fields?: string
  ): Promise<V> {
    try {
      // Validate using schema
      const validatedConfig = schema.parse(config);
      
      // Convert camelCase to snake_case for API params
      const params = humps.decamelizeKeys(validatedConfig);
      
      // API path based on entity type
      const path = `act_${adAccountId}/${entityType}s`;
      
      // Make the API request
      const response = await apiRequest<{id: string}>(
        baseUrl,
        path,
        accessToken,
        'POST',
        params
      );
      
      // If fields are provided, get the created entity
      if (fields) {
        const entity = await apiRequest<U>(
          baseUrl,
          `${response.id}`,
          accessToken,
          'GET',
          { fields }
        );
        
        return {
          success: true,
          id: response.id,
          data: entity
        } as unknown as V;
      }
      
      return {
        success: true,
        id: response.id
      } as unknown as V;
    } catch (error) {
      handleApiError(error, `create ${entityType}`);
      throw error; // Satisfy TypeScript
    }
  };
}

/**
 * Generic get operation for Facebook entities
 * 
 * @param entityType Entity type name (e.g., 'campaign', 'adset', 'ad')
 * @returns A function that retrieves the entity
 */
export function getOperation<T>(entityType: string) {
  return async function(
    baseUrl: string,
    accessToken: string,
    entityId: string,
    fields: string | string[]
  ): Promise<T> {
    try {
      // Format fields if it's an array
      const fieldString = Array.isArray(fields) ? fields.join(',') : fields;
      
      return await apiRequest<T>(
        baseUrl,
        entityId,
        accessToken,
        'GET',
        { fields: fieldString }
      );
    } catch (error) {
      handleApiError(error, `get ${entityType} ${entityId}`);
      throw error; // Satisfy TypeScript
    }
  };
}

/**
 * Generic update operation for Facebook entities
 * 
 * @param entityType Entity type name (e.g., 'campaign', 'adset', 'ad')
 * @returns A function that updates the entity
 */
export function updateOperation<T, U, V>(
  entityType: string,
) {
  return async function(
    baseUrl: string,
    accessToken: string,
    entityId: string,
    config: Partial<T>,
    fields?: string
  ): Promise<V> {
    try {
      // For updates, we accept partial data and skip validation
      // since z.ZodType doesn't directly support .partial() in a type-safe way
      
      // Convert camelCase to snake_case for API params
      const params = humps.decamelizeKeys(config);
      
      // Make the API request
      await apiRequest(
        baseUrl,
        entityId,
        accessToken,
        'POST',
        params
      );
      
      // If fields are provided, get the updated entity
      if (fields) {
        const entity = await apiRequest<U>(
          baseUrl,
          entityId,
          accessToken,
          'GET',
          { fields }
        );
        
        return {
          success: true,
          id: entityId,
          data: entity
        } as unknown as V;
      }
      
      return {
        success: true,
        id: entityId
      } as unknown as V;
    } catch (error) {
      handleApiError(error, `update ${entityType} ${entityId}`);
      throw error; // Satisfy TypeScript
    }
  };
}

/**
 * Generic list operation for Facebook entities
 * 
 * @param entityType Entity type name (e.g., 'campaign', 'adset', 'ad')
 * @returns A function that lists entities
 */
export function listOperation<T>(entityType: string) {
  return async function(
    baseUrl: string,
    adAccountId: string,
    accessToken: string,
    fields: string | string[],
    limit?: number,
    params: Record<string, any> = {}
  ): Promise<T[]> {
    try {
      // Format fields if it's an array
      const fieldString = Array.isArray(fields) ? fields.join(',') : fields;
      
      // Build request parameters
      const requestParams: Record<string, any> = {
        fields: fieldString,
        ...params
      };
      
      // Add limit if provided
      if (limit) {
        requestParams.limit = limit;
      }
      
      // Make the API request
      const response = await apiRequest<{data: T[]}>(
        baseUrl,
        `act_${adAccountId}/${entityType}s`,
        accessToken,
        'GET',
        requestParams
      );
      
      return response.data;
    } catch (error) {
      handleApiError(error, `list ${entityType}s`);
      throw error; // Satisfy TypeScript
    }
  };
} 