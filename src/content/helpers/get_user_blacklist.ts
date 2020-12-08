/**
 * @description returns the latest BlacklistMap saved in Chome as an array of strings
 */
export async function get_user_blacklist(): Promise<string[]> {
  return new Promise(resolve => {
    chrome.storage.sync.get(["blacklist"], blacklist => {
      const blacklistArray = Object.keys(blacklist["blacklist"]).reduce(
        (acc, key) => {
          const shouldBlacklist = blacklist["blacklist"][key];
          if (shouldBlacklist) acc.push(key);

          return acc;
        },
        [] as string[]
      );
      resolve(blacklistArray);
    });
  });
}
