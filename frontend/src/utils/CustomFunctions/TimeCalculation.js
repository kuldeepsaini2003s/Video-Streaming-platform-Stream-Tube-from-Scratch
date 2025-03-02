export const timeAgo = (createdAt) => {
  const now = new Date();
  const createdTime = new Date(createdAt);
  const diffInSeconds = Math.floor((now - createdTime) / 1000);

  const intervals = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "week", seconds: 604800 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
    { label: "second", seconds: 1 },
  ];

  for (const interval of intervals) {
    const timePassed = Math.floor(diffInSeconds / interval.seconds);
    if (timePassed > 0) {
      return `${timePassed} ${interval.label}${timePassed > 1 ? "s" : ""} ago`;
    }
  }

  return "just now";
};
