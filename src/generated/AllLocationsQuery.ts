/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: AllLocationsQuery
// ====================================================

export interface AllLocationsQuery_locations_nodes {
  __typename: "Location";
  id: string;
  name: string;
  slug: string;
  category: string | null;
  city: string | null;
  countryName: string | null;
}

export interface AllLocationsQuery_locations {
  __typename: "LocationConnection";
  /**
   * A list of nodes.
   */
  nodes: (AllLocationsQuery_locations_nodes | null)[] | null;
}

export interface AllLocationsQuery {
  /**
   * List all locations
   */
  locations: AllLocationsQuery_locations;
}
