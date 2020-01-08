/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: EventQuery
// ====================================================

export interface EventQuery_eventBySlug_hero {
  __typename: "Image";
  big: string;
}

export interface EventQuery_eventBySlug_header {
  __typename: "Image";
  big: string;
}

export interface EventQuery_eventBySlug_flyer {
  __typename: "Image";
  big: string;
}

export interface EventQuery_eventBySlug_galleryImages_nodes {
  __typename: "Image";
  id: string;
  medium: string;
  big: string;
}

export interface EventQuery_eventBySlug_galleryImages {
  __typename: "ImageConnection";
  /**
   * A list of nodes.
   */
  nodes: (EventQuery_eventBySlug_galleryImages_nodes | null)[] | null;
}

export interface EventQuery_eventBySlug_location {
  __typename: "Location";
  id: string;
  category: string | null;
  slug: string;
  name: string;
  city: string | null;
  address: string | null;
  zip: string | null;
  countryCode: string;
  lat: number | null;
  lon: number | null;
  timezone: string | null;
}

export interface EventQuery_eventBySlug {
  __typename: "Event";
  id: string;
  name: string;
  slug: string;
  categories: string[];
  liked: boolean;
  startAt: ISO8601DateTime;
  endAt: ISO8601DateTime;
  fullDay: boolean;
  organizerName: string | null;
  website: string | null;
  ticketLink: string | null;
  abstract: string | null;
  description: string | null;
  hero: EventQuery_eventBySlug_hero | null;
  header: EventQuery_eventBySlug_header | null;
  flyer: EventQuery_eventBySlug_flyer | null;
  galleryImages: EventQuery_eventBySlug_galleryImages;
  location: EventQuery_eventBySlug_location;
}

export interface EventQuery {
  /**
   * Retrieve an event by slug
   */
  eventBySlug: EventQuery_eventBySlug | null;
}

export interface EventQueryVariables {
  slug: string;
}
