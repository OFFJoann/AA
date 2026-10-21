const fallback: Record<string, string> = {
  'new:corolla-cross': 'https://www.toyota.com/content/dam/toyota/vehicles/2026/corollacross/mlp/marquee/CRC_MY26_NA-CAMP_Kickstarter_in_front_of_Art_Studio_Welcome_Mat_TCOM_Desktop_TDRHPMarqueeDeskTab1920x796_TYTW3261000H.mp4?wid=1919',
};

let urls: Record<string, string> = { ...fallback };

export const setVehicleVideoUrls = (map: Record<string, string>) => { urls = { ...map }; };

export const vehicleVideoUrl = (id: string): string | undefined => {
  const url = urls[id]?.trim();
  return url || undefined;
};
