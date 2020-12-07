import { BehaviorSubject } from "rxjs";
import { debounceTime, filter, throttleTime } from "rxjs/operators";
// Home Page Tasks
// Create a function that will look for youtube title elements ✅
// Search for blacklisted keywords ✅
// Delete the element on screen ✅
// Replace the video with another video further in the search results ✅
// If the video is in a sub-section I.E. Covid news in the COVID-19 section, remove the section entirely ✅
// Youtube will actively replace old videos so I have to find a resource friendly way to re-update all the old videos ✅
// (potentially send a http request saying not to recommend that content further)

(async () => {
  const USER_SETTINGS = {
    REMOVE_SECTIONS: true,
    BLACKLIST: ["music", "mean", "mandalorian", "kills", "stark", "covid"]
  };

  // async function get_user_blacklist(): Promise<string[]> {
  //   return new Promise<string[]>((resolve, reject) => {
  //     resolve(USER_SETTINGS.BLACKLIST);
  //   });
  // }

  async function get_user_blacklist(): Promise<string[]> {
    return new Promise((resolve, reject) => {
      chrome.storage.sync.get(["blacklist"], blacklist => {
        const blacklistArray = Object.keys(blacklist["blacklist"]).reduce(
          (acc, key) => {
            const shouldBlacklist = blacklist["blacklist"][key];
            if (shouldBlacklist) {
              acc.push(key);
            }
            return acc;
          },
          [] as string[]
        );
        resolve(blacklistArray);
      });
    });
  }

  const getParentElementOfType = (
    element: Element,
    name: string
  ): Element | null => {
    if (element.tagName.toLowerCase().includes(name)) {
      return element;
    }
    if (!element.parentElement) {
      return null;
    }
    return getParentElementOfType(element.parentElement, name);
  };

  // Also need to fire the function on new API requests to /browse after the data populates

  async function check_for_blacklisted_videos() {
    let elements = document.querySelectorAll("yt-formatted-string#video-title");
    const blacklist = await get_user_blacklist();

    for (let element of elements) {
      let innerHtml = element.innerHTML.toLowerCase();
      let blacklisted = false;
      let i = 0;
      while (blacklisted == false && i <= blacklist.length - 1) {
        let key = blacklist[i];
        if (innerHtml.includes(key)) {
          blacklisted = true;
        }
        i++;
      }

      if (blacklisted) {
        // Remove parent
        let parent = getParentElementOfType(element, "ytd-rich-item-renderer");

        if (parent == null) return console.log("No parent found");

        const contents = parent.parentElement;
        if (contents?.id == "contents") {
          const section = getParentElementOfType(
            parent,
            "ytd-rich-section-renderer"
          );
          // TODO in the future, have a users settings UI to change these
          if (USER_SETTINGS["REMOVE_SECTIONS"]) section?.remove();
          if (!!section) return;
        }
        fill_in_missing_video(parent);
      }
    }
  }

  function fill_in_missing_video(element: Element | null) {
    if (element == null) {
      return null;
    }

    const continuation = document.querySelector(
      "ytd-continuation-item-renderer"
    );
    let lastVideoInList = continuation?.previousElementSibling as Element;
    if (
      (lastVideoInList as Element)?.tagName
        .toLowerCase()
        .includes("ytd-rich-item-renderer")
    ) {
      let parent = continuation?.parentElement as Element;
      // let oldChild = parent.removeChild(lastVideoInList);
      element.insertAdjacentElement("afterend", lastVideoInList);

      element.remove();
    }
  }

  let rxInsertEvents = new BehaviorSubject<Event>(null as any);

  const grid_renderer = document.querySelector("ytd-rich-grid-renderer");
  window?.addEventListener(
    "scroll",
    event => {
      rxInsertEvents.next(event);
    },
    false
  );
  grid_renderer?.addEventListener(
    "mouseenter",
    event => rxInsertEvents.next(event),
    false
  );
  grid_renderer?.addEventListener(
    "mouseleave",
    event => rxInsertEvents.next(event),
    false
  );
  grid_renderer?.addEventListener(
    "DOMContentLoaded",
    event => rxInsertEvents.next(event),
    false
  );

  let running = false;
  rxInsertEvents.subscribe(async () => {
    if (running) return;
    running = true;
    console.time("Video Blacklist Check");
    await check_for_blacklisted_videos();
    console.timeEnd("Video Blacklist Check");
    running = false;
  });
})();
