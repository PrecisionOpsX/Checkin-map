import type { Location } from '@/types';

/**
 * Curated sample locations used during development. In Milestone 4 the
 * client will manage these from a web admin panel and they will live in
 * Firestore. For now they are seeded here so the map has something to show
 * out of the box.
 *
 * Pick coordinates near you for realistic testing, or set
 * EXPO_PUBLIC_DEV_LAT and EXPO_PUBLIC_DEV_LNG in .env to override the
 * map's initial center.
 */
export const SAMPLE_LOCATIONS: Location[] = [
  {
    id: 'loc_central_court',
    name: 'Central Park Courts',
    description: 'Outdoor basketball courts, full-length, three rims. Open dawn to dusk.',
    category: 'Basketball',
    latitude: 40.7829,
    longitude: -73.9654,
    address: 'Central Park, New York, NY',
    photoURL: null,
  },
  {
    id: 'loc_riverside_park',
    name: 'Riverside Park',
    description: 'Two half-courts along the Hudson. Quieter mornings.',
    category: 'Basketball',
    latitude: 40.7956,
    longitude: -73.9722,
    address: 'Riverside Dr, New York, NY',
    photoURL: null,
  },
  {
    id: 'loc_west_4th',
    name: 'West 4th Street Courts',
    description: 'The legendary Cage. Pickup runs all summer.',
    category: 'Basketball',
    latitude: 40.7314,
    longitude: -74.0001,
    address: 'W 4th St, New York, NY',
    photoURL: null,
  },
  {
    id: 'loc_chelsea_piers',
    name: 'Chelsea Piers',
    description: 'Indoor courts, leagues and open gym sessions.',
    category: 'Indoor',
    latitude: 40.7479,
    longitude: -74.0083,
    address: 'Pier 60, New York, NY',
    photoURL: null,
  },
  {
    id: 'loc_pier_2',
    name: 'Brooklyn Bridge Park Pier 2',
    description: 'Five courts under cover. Great views, packed evenings.',
    category: 'Basketball',
    latitude: 40.6997,
    longitude: -73.9981,
    address: 'Pier 2, Brooklyn, NY',
    photoURL: null,
  },
  {
    id: 'loc_mccarren_park',
    name: 'McCarren Park',
    description: 'Williamsburg favorite. Mostly half-court runs.',
    category: 'Basketball',
    latitude: 40.7204,
    longitude: -73.9521,
    address: 'McCarren Park, Brooklyn, NY',
    photoURL: null,
  },
  {
    id: 'loc_hudson_yards',
    name: 'Hudson Yards Rec',
    description: 'New courts, smooth surface, good lighting at night.',
    category: 'Basketball',
    latitude: 40.7536,
    longitude: -74.0014,
    address: '11th Ave, New York, NY',
    photoURL: null,
  },
];

export const DEFAULT_MAP_CENTER = {
  latitude: parseFloat(process.env.EXPO_PUBLIC_DEV_LAT || '40.758'),
  longitude: parseFloat(process.env.EXPO_PUBLIC_DEV_LNG || '-73.985'),
  latitudeDelta: 0.08,
  longitudeDelta: 0.08,
};
