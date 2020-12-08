import { BehaviorSubject } from "rxjs";
import { add_event_listeners } from "./helpers/add_event_listeners";
import { check_for_blacklisted_videos } from "./helpers/check_for_blacklisted_videos";
import { url_includes } from "./helpers/url_includes";

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

  if (url_includes("watch")) {
    await watch_page_title_text_search();
    await watch_page_channel_name_search();
  } else if (url_includes("results")) {
    await results_page_title_text_search();
    await results_page_channel_name_search();
  } else {
    await homepage_title_text_search();
    await homepage_channel_name_search();
  }

  running = false;
};

/**
 *  rxEvents fires for every time .next() is called,
 * but if it's already in operation it doesn't check the blacklist
 */
rxEvents.subscribe(block_videos_based_on_url_path);

async function watch_page_title_text_search() {
  await check_for_blacklisted_videos(
    "span#video-title",
    "ytd-compact-video-renderer",
    false
  );
}

async function watch_page_channel_name_search() {
  await check_for_blacklisted_videos(
    "yt-formatted-string.ytd-channel-name",
    "ytd-compact-video-renderer",
    false
  );
}

async function results_page_channel_name_search() {
  await check_for_blacklisted_videos(
    "yt-formatted-string.ytd-channel-name",
    "ytd-video-renderer",
    false
  );
}

async function results_page_title_text_search() {
  await check_for_blacklisted_videos(
    "yt-formatted-string#video-title",
    "ytd-video-renderer",
    false
  );
}

async function homepage_title_text_search() {
  await check_for_blacklisted_videos(
    "yt-formatted-string#video-title",
    "ytd-rich-item-renderer"
  );
}

async function homepage_channel_name_search() {
  await check_for_blacklisted_videos(
    "a.yt-formatted-string.yt-simple-endpoint",
    "ytd-rich-item-renderer"
  );
}
