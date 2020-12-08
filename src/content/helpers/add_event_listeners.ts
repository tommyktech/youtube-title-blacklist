import { BehaviorSubject } from "rxjs";

/**
 * @description Adds event listeners that push all events to a single RXJS BehaviorSubject.
 * @param opts {rxEvents: BehaviorSubject<Event>, element: Element | null}
 */
export function add_event_listeners({
  rxEvents,
  element
}: {
  rxEvents: BehaviorSubject<Event>;
  element: Element | null;
}): void {
  includeScrolling(rxEvents);
  if (!element) return;

  includeMouseEnter(element, rxEvents);
  includeMouseLeave(element, rxEvents);
  includeDOMContentLoaded(element, rxEvents);
}

/**
 * @description will try to trigger a search for blacklisted videos on mouseenter for a given element
 */
function includeMouseEnter(element: Element, rxEvents: BehaviorSubject<Event>) {
  element.addEventListener("mouseenter", event => rxEvents.next(event), false);
}

/**
 * @description will try to trigger a search for blacklisted videos on mouseleave for a given element
 */
function includeMouseLeave(element: Element, rxEvents: BehaviorSubject<Event>) {
  element.addEventListener("mouseleave", event => rxEvents.next(event), false);
}

/**
 * @description will try to trigger a search for blacklisted videos on DOMContentLoaded for a given element
 */
function includeDOMContentLoaded(
  element: Element,
  rxEvents: BehaviorSubject<Event>
) {
  element.addEventListener(
    "DOMContentLoaded",
    event => rxEvents.next(event),
    false
  );
}

/**
 * @description will try to trigger a search for blacklisted videos on scroll. This is the main function that triggers search events.
 */
function includeScrolling(rxEvents: BehaviorSubject<Event>) {
  window?.addEventListener(
    "scroll",
    event => {
      rxEvents.next(event);
    },
    false
  );
}
