import { useEffect, useState } from "./react-deps.js";

export default () => {
  const [path] = useState(location.pathname);
  const [search, update] = useState(location.search);

  useEffect(() => {
    patchHistoryEvents();

    const events = ["popstate", "pushState", "replaceState"];
    const handler = () => update(location.search);

    events.map(e => addEventListener(e, handler));
    return () => events.map(e => removeEventListener(e, handler));
  }, []);


  return [
    Array.from(new URLSearchParams(search)),
    (searchParams, replace) => 
      history[replace ? "replaceState" : "pushState"](0, 0, `${path}?${searchParams.map(([k, v]) => `${k}=${v}`).join("&")}`)
  ];
};

// While History API does have `popstate` event, the only
// proper way to listen to changes via `push/replaceState`
// is to monkey-patch these methods.
//
// See https://stackoverflow.com/a/4585031

let patched = 0
const patchHistoryEvents = () => {
  if (patched) return;

  ["pushState", "replaceState"].map(type => {
    const original = history[type];

    history[type] = function () {
      const result = original.apply(this, arguments);
      const event = new Event(type);
      event.arguments = arguments;

      dispatchEvent(event);
      return result;
    };
  });

  return (patched = 1);
};
