import React from 'react';

// A curated list of common timezones. A full list can be very long.
const commonTimezones = [
    "UTC", "GMT",
    "America/New_York", "America/Chicago", "America/Denver", "America/Los_Angeles",
    "Europe/London", "Europe/Paris", "Europe/Berlin", "Europe/Moscow",
    "Asia/Tokyo", "Asia/Shanghai", "Asia/Dubai", "Asia/Kolkata",
    "Australia/Sydney", "Australia/Perth",
    "Africa/Cairo", "Africa/Johannesburg", "Africa/Lagos",
];

// Add the user's local timezone if it's not already in the list
const localTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
if (!commonTimezones.includes(localTimezone)) {
    commonTimezones.unshift(localTimezone);
}

interface TimezoneSelectProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const TimezoneSelect: React.FC<TimezoneSelectProps> = ({ value, onChange, className }) => {
  return (
    <select
      id="timezone"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required
      className={`mt-1 block w-full bg-white/5 border border-white/10 rounded-md py-2 px-3 text-sm focus:ring-2 focus:ring-nebula-600 focus:outline-none ${className}`}
    >
      <option value="" disabled>Select a timezone</option>
      {commonTimezones.sort().map(tz => (
        <option key={tz} value={tz}>{tz.replace(/_/g, ' ')}</option>
      ))}
    </select>
  );
};

export default TimezoneSelect;