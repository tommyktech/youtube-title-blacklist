import { BehaviorSubject } from "rxjs";
import { add_event_listeners } from "./helpers/add_event_listeners";
import { check_for_blacklisted_videos } from "./helpers/check_for_blacklisted_videos";

const rxEvents = new BehaviorSubject(null as any);

const youtube_video_grid = document.querySelector("ytd-rich-grid-renderer");

// Add Event listeners on the grid renderer that will be pushed to rxEvents
add_event_listeners({ rxEvents: rxEvents, element: youtube_video_grid });

// rxEvents fires for every time .next() is called,
// but if it's already in operation it doesn't check the blacklist
let running = false;
rxEvents.subscribe(async () => {
  if (running) return;
  running = true;
  if (window.location.href.includes("watch")) {
    console.log("Watchpage Detected, blocking for Watchpage elements");
    await check_for_blacklisted_videos(
      "span#video-title",
      "ytd-compact-video-renderer"
    );
  } else {
    console.log("Homepage Detected, blocking for Homepage elements");
    await check_for_blacklisted_videos(
      "yt-formatted-string#video-title",
      "ytd-rich-item-renderer",
      false
    );
  }

  running = false;
});
