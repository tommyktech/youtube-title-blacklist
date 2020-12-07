/**
 * @description replaces the given element with a video further down the list -
 * removes element
 */
export function fill_in_missing_video(element: Element | null) {
  if (element == null) {
    return null;
  }

  const load_more_spinner = document.querySelector(
    "ytd-continuation-item-renderer"
  );
  let lastVideoInList = load_more_spinner?.previousElementSibling as Element;
  if (is_a_video_tile(lastVideoInList)) {
    element.insertAdjacentElement("afterend", lastVideoInList);
    element.remove();
  }
}

/**
 * @description checks to see if the element behind the spinner is a video tile.
 */
function is_a_video_tile(lastVideoInList: Element) {
  return (lastVideoInList as Element)?.tagName
    .toLowerCase()
    .includes("ytd-rich-item-renderer");
}
