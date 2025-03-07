import { round, floor, padStart } from "lodash";

export const YOUTUBE_API_KEY = "AIzaSyB_0tssWKUF2AGkgH3eYLVAQLRkY1yNt9I"; // youtube api 1

export const LOCAL_BACKEND_USER = "http://localhost:8000/api/users";
export const LOCAL_BACKEND_VIDEO = "http://localhost:8000/api/videos";
export const LOCAL_BACKEND_PLAYLIST = "http://localhost:8000/api/playlists";
export const LOCAL_BACKEND_LIKE = "http://localhost:8000/api/likes";
export const LOCAL_BACKEND_SUBSCRIPTION =
  "http://localhost:8000/api/subscriptions";
export const LOCAL_BACKEND_COMMENT = "http://localhost:8000/api/comments";

export const BACKEND_USER = "https://streamtube-kuldeep.onrender.com/api/users";
export const BACKEND_VIDEO =
  "https://streamtube-kuldeep.onrender.com/api/videos";
export const BACKEND_PLAYLIST =
  "https://streamtube-kuldeep.onrender.com/api/playlists";
export const BACKEND_LIKE = "https://streamtube-kuldeep.onrender.com/api/likes";
export const BACKEND_SUBSCRIPTION =
  "https://streamtube-kuldeep.onrender.com/api/subscriptions";
export const BACKEND_COMMENT =
  "https://streamtube-kuldeep.onrender.com/api/comments";

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
