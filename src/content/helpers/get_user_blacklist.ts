/**
 * @description returns the latest BlacklistMap saved in Chome as an array of strings
 */
export async function get_user_blacklist(): Promise<string[]> {
  return new Promise(resolve => {
    chrome.storage.sync.get(["blacklist"], stored_data => {
      if (Object.keys(stored_data).includes("blacklist")) {
        const blacklistArray = Object.keys(stored_data["blacklist"]).reduce(
          (acc, key) => {
            const shouldBlacklist = stored_data["blacklist"][key];
            if (shouldBlacklist) acc.push(key);

            return acc;
          },
          [] as string[]
        );
        resolve(blacklistArray);
      } else resolve([]);
    });
  });
}
