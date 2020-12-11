import { BehaviorSubject } from "rxjs";
import { add_event_listeners } from "./helpers/add_event_listeners";
import { check_for_blacklisted_videos } from "./helpers/check_for_blacklisted_videos";
import { url_includes } from "./helpers/url_includes";
import { array_unique } from "./helpers/array_unique";

const rxEvents = new BehaviorSubject(null as any);
let running = false;

const youtube_video_grid = document.querySelector("ytd-rich-grid-renderer");

/**
 *  Add Event listeners on the grid renderer that will be pushed to rxEvents
 */
add_event_listeners({ rxEvents: rxEvents, element: youtube_video_grid });

/**
 * @description
 * finds what page the user is on and based on that,
 * determines how it needs to remove elements.
 */
const block_videos_based_on_url_path = async () => {
  if (running) return;
  running = true;

  const blocked_tiles = url_includes("watch")
    ? await filter_watch_page()
    : url_includes("results")
    ? await filter_results_page()
    : await filter_homepage();

  for (const blocked_tile of blocked_tiles) blocked_tile.style.display = "none";

  running = false;
};

/**
 *  rxEvents fires for every time .next() is called,
 * but if it's already in operation it doesn't check the blacklist
 */
rxEvents.subscribe(block_videos_based_on_url_path);

async function filter_watch_page() {
  const blocked_by_title = await check_for_blacklisted_videos(
    "span#video-title",
    "ytd-compact-video-renderer"
  );
  const blocked_by_channel_name = await check_for_blacklisted_videos(
    "yt-formatted-string.ytd-channel-name",
    "ytd-compact-video-renderer"
  );
  return array_unique([...blocked_by_title, ...blocked_by_channel_name]);
}

async function filter_results_page() {
  const blocked_by_title = await check_for_blacklisted_videos(
    "yt-formatted-string#video-title",
    "ytd-video-renderer"
  );
  const blocked_by_channel_name = await check_for_blacklisted_videos(
    "yt-formatted-string.ytd-channel-name",
    "ytd-video-renderer"
  );
  return array_unique([...blocked_by_title, ...blocked_by_channel_name]);
}

async function filter_homepage() {
  const blocked_by_title = await check_for_blacklisted_videos(
    "yt-formatted-string#video-title",
    "ytd-rich-item-renderer"
  );
  const blocked_by_channel_name = await check_for_blacklisted_videos(
    "a.yt-formatted-string.yt-simple-endpoint",
    "ytd-rich-item-renderer"
  );
  return array_unique([...blocked_by_title, ...blocked_by_channel_name]);
}
