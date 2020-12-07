import { useEffect, useState } from "react";
import { BlacklistMap } from "../App";

export function useBlacklist() {
  const [blacklist, setBlacklist] = useState<BlacklistMap | null>(null);
  const [firstBlacklist, setFirstBlacklist] = useState<BlacklistMap | null>(
    null
  );

  useEffect(() => {
    chrome.storage.sync.get(["blacklist"], data => {
      setBlacklist(data["blacklist"]);
      setFirstBlacklist(data["blacklist"]);
    });
  }, []);

  return { blacklist, setBlacklist, firstBlacklist };
}
