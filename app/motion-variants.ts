// Shared layoutId between a playground row name and its showcase page title —
// the element that morphs across the route change. Lives in this plain module
// so server components (the playground pages) can build the id too.
export const playgroundMorphId = (id: string) => `playground-morph-${id}`;
