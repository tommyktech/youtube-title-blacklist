import { get_user_blacklist } from "./get_user_blacklist";
import { get_recommended_video_tile } from "./get_recommended_video_tile";
import { fill_in_missing_video } from "./fill_in_missing_video";
import { USER_SETTINGS } from "./_user_settings";

/**
 * @description
 * gets the latest user blacklist -
 * checks all video title elements -
 * if a blacklisted video is found, remove it and display another in its place
 */
export async function check_for_blacklisted_videos() {
  let elements = document.querySelectorAll("yt-formatted-string#video-title");
  const blacklist = await get_user_blacklist();

  for (let element of elements) {
    let innerHtml = element.innerHTML.toLowerCase();

    if (check_for_blacklisted_words(blacklist, innerHtml)) {
      let video_tile = get_recommended_video_tile(
        element,
        "ytd-rich-item-renderer"
      );

      if (!video_tile) return;

      if (is_homepage(video_tile.parentElement)) {
        const section = check_if_video_is_in_section(video_tile);

        if (!!section) {
          if (USER_SETTINGS["REMOVE_SECTIONS"]) section?.remove();

          // return here to stop the "fill in missing video" as an entire section was removed
          return;
        }
      }
      fill_in_missing_video(video_tile);
    }
  }
}

/**
 * @description
 * Checks to see if a given video tile is within a "section" and returns the element if so.
 * This is usuallly 4 videos with a special title.
 * "Trending" "Breaking News" etc..
 */
function check_if_video_is_in_section(video_tile: Element) {
  const section = get_recommended_video_tile(
    video_tile,
    "ytd-rich-section-renderer"
  );

  return section;
}

/**
 * @description
 * Checks the ID of the parent surrounding the video tile which matches the one on the home page.
 */
function is_homepage(parent_of_video_tile: HTMLElement | null) {
  return parent_of_video_tile?.id == "contents";
}

/**
 * @param blacklist A list of user supplied strings to block
 * @param innerHtml Title of a recommended video
 *
 * @description
 * Loops through all the blacklist strings to see if any are included in the title -
 * If one match is found, the function returns true -
 * else returns false
 */
function check_for_blacklisted_words(blacklist: string[], innerHtml: string) {
  let blacklisted = false;
  let i = 0;
  while (blacklisted == false && i <= blacklist.length - 1) {
    let key = blacklist[i];
    if (innerHtml.includes(key)) {
      blacklisted = true;
    }
    i++;
  }
  return blacklisted;
}
