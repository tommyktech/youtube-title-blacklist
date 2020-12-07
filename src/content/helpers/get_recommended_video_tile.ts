/**
 * @description Moves up the parent tree until it finds an element that includes the name specified
 */
export const get_recommended_video_tile = (
  element: Element,
  name: string
): Element | null => {
  if (element.tagName.toLowerCase().includes(name)) {
    return element;
  }
  if (!element.parentElement) {
    return null;
  }
  return get_recommended_video_tile(element.parentElement, name);
};
