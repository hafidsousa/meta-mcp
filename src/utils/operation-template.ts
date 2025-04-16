/**
 * @fileoverview Templates for common operation patterns with Facebook Marketing API
 * 
 * @note IMPORTANT: This is a pure pass-through proxy.
 */

import { apiRequest } from './api';

/**
 * Creates a template for entity creation operations
 * @param pathFn Function to generate the path for the API request
 * @returns Function for creating entities
 */
export function createEntityTemplate(
  pathFn: (baseUrl: string, adAccountId: string) => string,
  fieldsForGet: string,
) {
  /**
   * Creates an entity
   * @param baseUrl Base URL for the API
   * @param adAccountId Ad account ID
   * @param accessToken Facebook access token
   * @param config Entity configuration
   * @returns Promise with entity creation response
   */
  return async function(
    baseUrl: string,
    adAccountId: string,
    accessToken: string,
    config: any
  ): Promise<any> {
    try {
      // Path for the API request
      const path = pathFn(baseUrl, adAccountId);
      
      // Pass parameters directly to Facebook API
      const response = await apiRequest(
        baseUrl,
        path,
        accessToken,
        'POST',
        config
      );

      // Get the created entity
      if (response && response.id) {
        const entity = await apiRequest(
          baseUrl,
          `${response.id}`,
          accessToken,
          'GET',
          { fields: fieldsForGet }
        );

        return {
          success: true,
          id: response.id,
          data: entity
        };
      } else {
        throw new Error('No ID returned from create operation');
      }
    } catch (error) {
      // Pass error directly
      throw error;
    }
  };
}

/**
 * Creates a template for entity retrieval operations
 * @param fieldsArr Array of fields to retrieve
 * @returns Function for retrieving entities
 */
export function getEntityTemplate(
  fieldsArr: string[]
) {
  /**
   * Retrieves an entity by ID
   * @param baseUrl Base URL for the API
   * @param accessToken Facebook access token
   * @param entityId The ID of the entity to retrieve
   * @returns Promise with entity data
   */
  return async function(
    baseUrl: string,
    accessToken: string,
    entityId: string
  ): Promise<any> {
    // Join fields for the API request
    const fields = fieldsArr.join(',');

    return await apiRequest(
      baseUrl,
      entityId,
      accessToken,
      'GET',
      { fields }
    );
  };
}

/**
 * Creates a template for entity update operations
 * @param getEntityFn Function to retrieve the updated entity
 * @returns Function for updating entities
 */
export function updateEntityTemplate(
  getEntityFn: (baseUrl: string, accessToken: string, entityId: string) => Promise<any>
) {
  /**
   * Updates an entity
   * @param baseUrl Base URL for the API
   * @param accessToken Facebook access token
   * @param entityId The ID of the entity to update
   * @param config Entity configuration object with fields to update
   * @returns Promise with updated entity data
   */
  return async function(
    baseUrl: string,
    accessToken: string,
    entityId: string,
    config: any
  ): Promise<any> {
    try {
      // Pass config directly to API
      await apiRequest(
        baseUrl,
        entityId,
        accessToken,
        'POST',
        config
      );

      // Get updated entity
      const entity = await getEntityFn(baseUrl, accessToken, entityId);

      return {
        success: true,
        id: entityId,
        data: entity
      };
    } catch (error) {
      // Pass error directly
      throw error;
    }
  };
}

/**
 * Creates a template for retrieving multiple entities
 * @param pathFn Function to generate the path for the API request
 * @param fieldsArr Array of fields to retrieve
 * @returns Function for retrieving multiple entities
 */
export function getEntitiesTemplate(
  pathFn: (baseUrl: string, idOrAccountId: string) => string,
  fieldsArr: string[]
) {
  /**
   * Retrieves multiple entities
   * @param baseUrl Base URL for the API
   * @param idOrAccountId Entity ID or account ID
   * @param accessToken Facebook access token
   * @param additionalParams Additional parameters for the API request
   * @returns Promise with array of entities
   */
  return async function(
    baseUrl: string,
    idOrAccountId: string,
    accessToken: string,
    additionalParams: Record<string, any> = {}
  ): Promise<any[]> {
    // Path for the API request
    const path = pathFn(baseUrl, idOrAccountId);
    
    // Create parameter object
    const params: Record<string, any> = {
      ...additionalParams,
      fields: fieldsArr.join(',')
    };

    // Make the API request
    const response = await apiRequest(
      baseUrl,
      path,
      accessToken,
      'GET',
      params
    );

    return response.data || [];
  };
} 