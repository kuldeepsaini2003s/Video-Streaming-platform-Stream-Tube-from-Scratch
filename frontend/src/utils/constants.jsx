export const YOUTUBE_API_KEY = "AIzaSyB_0tssWKUF2AGkgH3eYLVAQLRkY1yNt9I"; // youtube api 1

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const LOCALHOST_URL = import.meta.env.VITE_LOCALHOST_URL;

export const BACKEND_USER = `${BACKEND_URL}/users`;
export const BACKEND_VIDEO = `${BACKEND_URL}/videos`;
export const BACKEND_PLAYLIST = `${BACKEND_URL}/playlists`;
export const BACKEND_LIKE = `${BACKEND_URL}/likes`;
export const BACKEND_SUBSCRIPTION = `${BACKEND_URL}/subscriptions`;
export const BACKEND_COMMENT = `${BACKEND_URL}/comments`;

export const YOUTUBE_VIDEOS_API =
  "https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&maxResults=50&regionCode=IN&key=" +
  YOUTUBE_API_KEY;

export const YOUTUBE_CHANNEL_NAME =
  "https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&id=UC2bNrKQbJLphxNCd6BSnTkA&key=" +
  YOUTUBE_API_KEY;

export const YOUTUBE_COMMENTS_API =
  "https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet%2Creplies&videoId=_VB39Jo8mAQ&key=" +
  YOUTUBE_API_KEY;

export const YOUTUBE_CATEGORIES_API =
  "https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&regionCode=US&videoCategoryId=20&key=" +
  YOUTUBE_API_KEY;

export const YOUTUBE_RECOMMENDED_VIDEOS_API =
  "https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&regionCode=US&key=" +
  YOUTUBE_API_KEY;

export const YOUTUBE_SEARCH_API =
  "https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=25&q=surfing&key=" +
  YOUTUBE_API_KEY;

export const YOUTUBE_SEARCH_SUGGESTION =
  "http://suggestqueries.google.com/complete/search?client=youtube&ds=yt&client=firefox&q=";

export const formatViewCount = (viewCount) => {
  if (viewCount >= 1e6) {
    return (viewCount / 1e6).toFixed(1) + "M";
  } else if (viewCount >= 1e3) {
    return (viewCount / 1e3).toFixed(1) + "K";
  } else {
    return viewCount.toString();
  }
};

export function formatDuration(seconds) {
  const totalSeconds = Math.round(seconds);

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const remainingSeconds = totalSeconds % 60;

  const formattedMinutes =
    hours > 0 ? String(minutes).padStart(2, "0") : minutes;
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return hours > 0
    ? `${hours}:${formattedMinutes}:${formattedSeconds}`
    : `${formattedMinutes}:${formattedSeconds}`;
}

export const categories = [
  "Education",
  "Entertainment",
  "Gaming",
  "Music",
  "Animal",
  "Nature",
  "Cartoon",
  "Anime",
  "Tech",
  "Vlogs",
  "How-to & Style",
  "News & Politics",
  "Sports",
  "Travel & Events",
];
