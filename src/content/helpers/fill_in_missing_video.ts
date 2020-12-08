/**
 * @description replaces the given element with a video further down the list -
 * removes element
 */
export function fill_in_video(element: Element | null): void {
  if (element == null) return;

  const load_more_spinner = document.querySelector(
    "ytd-continuation-item-renderer"
  );
  const lastVideoInList = load_more_spinner?.previousElementSibling as Element;
  if (is_a_video_tile(lastVideoInList))
    element.insertAdjacentElement("afterend", lastVideoInList);
}

/**
 * @description checks to see if the element behind the spinner is a video tile.
 */
function is_a_video_tile(lastVideoInList: Element) {
  return (lastVideoInList as Element)?.tagName
    .toLowerCase()
    .includes("ytd-rich-item-renderer");
}
