import { supabase } from "@/integrations/supabase/client";

interface VisitorData {
  visitorId: string;
  country?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  browser?: string;
  os?: string;
  deviceType?: string;
  language?: string;
  referrer?: string;
}

const generateVisitorId = () => {
  const storedId = localStorage.getItem('visitor_id');
  if (storedId) return storedId;
  
  const newId = crypto.randomUUID();
  localStorage.setItem('visitor_id', newId);
  return newId;
};

const getBrowserInfo = () => {
  const ua = navigator.userAgent;
  const browser = 
    ua.includes('Firefox') ? 'Firefox' :
    ua.includes('Chrome') ? 'Chrome' :
    ua.includes('Safari') ? 'Safari' :
    ua.includes('Edge') ? 'Edge' :
    'Other';

  const os = 
    ua.includes('Windows') ? 'Windows' :
    ua.includes('Mac') ? 'MacOS' :
    ua.includes('Linux') ? 'Linux' :
    ua.includes('Android') ? 'Android' :
    ua.includes('iOS') ? 'iOS' :
    'Other';

  const deviceType = 
    /Mobile|Android|iPhone|iPad|iPod/i.test(ua) ? 'Mobile' :
    /Tablet|iPad/i.test(ua) ? 'Tablet' :
    'Desktop';

  return { browser, os, deviceType };
};

export const trackVisitor = async () => {
  try {
    const visitorId = generateVisitorId();
    const { browser, os, deviceType } = getBrowserInfo();
    
    // Get geolocation data
    const response = await fetch('https://ipapi.co/json/');
    const geoData = await response.json();
    
    const visitorData: VisitorData = {
      visitorId,
      country: geoData.country_name,
      city: geoData.city,
      latitude: geoData.latitude,
      longitude: geoData.longitude,
      browser,
      os,
      deviceType,
      language: navigator.language,
      referrer: document.referrer,
    };

    const { error } = await supabase
      .from('visitor_analytics')
      .insert([{
        visitor_id: visitorData.visitorId,
        country: visitorData.country,
        city: visitorData.city,
        latitude: visitorData.latitude,
        longitude: visitorData.longitude,
        browser: visitorData.browser,
        os: visitorData.os,
        device_type: visitorData.deviceType,
        language: visitorData.language,
        referrer: visitorData.referrer,
      }]);

    if (error) {
      console.error('Error tracking visitor:', error);
    }

    return visitorData;
  } catch (error) {
    console.error('Error tracking visitor:', error);
    return null;
  }
};