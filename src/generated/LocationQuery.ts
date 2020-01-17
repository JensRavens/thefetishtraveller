/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: LocationQuery
// ====================================================

export interface LocationQuery_locationBySlug_events_nodes_hero {
  __typename: "Image";
  medium: string;
}

export interface LocationQuery_locationBySlug_events_nodes_location {
  __typename: "Location";
  id: string;
  name: string;
  city: string | null;
  category: string | null;
  countryName: string | null;
}

export interface LocationQuery_locationBySlug_events_nodes {
  __typename: "Event";
  id: string;
  name: string;
  slug: string;
  endAt: ISO8601DateTime;
  startAt: ISO8601DateTime;
  fullDay: boolean;
  categories: string[];
  hero: LocationQuery_locationBySlug_events_nodes_hero | null;
  location: LocationQuery_locationBySlug_events_nodes_location;
}

export interface LocationQuery_locationBySlug_events {
  __typename: "EventConnection";
  /**
   * A list of nodes.
   */
  nodes: (LocationQuery_locationBySlug_events_nodes | null)[] | null;
}

export interface LocationQuery_locationBySlug {
  __typename: "Location";
  id: string;
  name: string;
  city: string | null;
  countryName: string | null;
  lat: number | null;
  lon: number | null;
  category: string | null;
  events: LocationQuery_locationBySlug_events;
}

export interface LocationQuery {
  /**
   * Retrieve a location by slug
   */
  locationBySlug: LocationQuery_locationBySlug | null;
}

export interface LocationQueryVariables {
  slug: string;
}
