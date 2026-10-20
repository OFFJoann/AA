import type { Location } from '../data.ts';
/** No invented coordinates or business IDs. Official Maps URLs need no API key. */
export function mapLinks(location: Location){
  const query=location.mapsQuery||`${location.address.replaceAll(' · ', ', ')}, ${location.city}, Antioquia, Colombia`;
  const search=new URL('https://www.google.com/maps/search/');search.searchParams.set('api','1');search.searchParams.set('query',query);
  const directions=new URL('https://www.google.com/maps/dir/');directions.searchParams.set('api','1');directions.searchParams.set('destination',query);
  if(location.googlePlaceId){search.searchParams.set('query_place_id',location.googlePlaceId);directions.searchParams.set('destination_place_id',location.googlePlaceId);}
  const fallback=new URL('https://www.google.com/maps');fallback.searchParams.set('q',query);fallback.searchParams.set('z','16');fallback.searchParams.set('output','embed');fallback.searchParams.set('hl','es');
  let embed=fallback.href;
  // A reviewed src from Google Maps > Share > Embed a map can replace the query fallback.
  if(location.googleEmbedUrl){try{const u=new URL(location.googleEmbedUrl);if(u.protocol==='https:'&&u.hostname==='www.google.com'&&u.pathname.startsWith('/maps/embed'))embed=u.href;}catch{/* Keep address search. */}}
  return {search:search.href,directions:directions.href,embed};
}
