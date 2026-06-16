export function getSessionStatus() {
  const d = new Date();
  const utc = d.getTime() + (d.getTimezoneOffset() * 60000);
  const istDate = new Date(utc + (3600000 * 5.5)); // Convert to IST (UTC+5:30)

  const h = istDate.getHours();
  const m = istDate.getMinutes();
  const totalMins = h * 60 + m;

  // New Shop Timings:
  // Morning: 9:00 AM to 1:00 PM (9 * 60 = 540 to 13 * 60 = 780 mins)
  // Evening: 4:00 PM to 8:30 PM (16 * 60 = 960 to 20.5 * 60 = 1230 mins)
  const isMorningWindow = totalMins >= 9 * 60 && totalMins < 13 * 60;
  const isEveningWindow = totalMins >= 16 * 60 && totalMins < 20.5 * 60;

  // Determine current session based on time of day (even if closed, to allow entries)
  // Switch session at 3:00 PM (15 * 60 = 900 mins)
  const currentSession = totalMins < 15 * 60 ? 'morning' : 'evening';

  if (isMorningWindow) {
    return {
      active: true,
      session: 'morning',
      labelGu: '🟢 દુકાન ચાલુ છે (સવાર)',
      labelEn: 'Shop Open (Morning)',
    };
  }

  if (isEveningWindow) {
    return {
      active: true,
      session: 'evening',
      labelGu: '🟢 દુકાન ચાલુ છે (સાંજ)',
      labelEn: 'Shop Open (Evening)',
    };
  }

  // If closed and after evening shift (after 8:30 PM), suggest EOD report download
  if (totalMins >= 20.5 * 60) {
    return {
      active: false,
      session: currentSession,
      labelGu: '🔴 દુકાન બંધ છે — અહેવાલ ડાઉનલોડ કરો',
      labelEn: 'Shop Closed — Download EOD Report',
    };
  }

  return {
    active: false,
    session: currentSession,
    labelGu: '🔴 દુકાન બંધ છે',
    labelEn: 'Shop Closed',
  };
}

export function isDownloadAllowed() {
  const d = new Date();
  const utc = d.getTime() + (d.getTimezoneOffset() * 60000);
  const istDate = new Date(utc + (3600000 * 5.5));
  // Download is allowed from 8:30 PM onwards
  return (istDate.getHours() * 60 + istDate.getMinutes()) >= (20.5 * 60);
}

export function formatIstDate(dateString) {
  if (!dateString) return '';
  const parts = dateString.split('-');
  if (parts.length !== 3) return dateString;
  return `${parts[2]}/${parts[1]}/${parts[0]}`; // DD/MM/YYYY
}
