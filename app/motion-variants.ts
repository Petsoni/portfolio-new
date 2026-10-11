// Shared layoutId between a playground row name and its showcase page title —
// the element that morphs across the route change. Lives in this plain module
// so server components (the playground pages) can build the id too.
export const playgroundMorphId = (id: string) => `playground-morph-${id}`;

// Near-critically damped spring for return morphs: the experience row taking
// the card back in (the row drives that animation — it becomes the lead
// element when the card exits) and the playground title flights. Any
// overshoot there makes the text look squished as the box wobbles. Lives
// here, not with the modal, so the playground pages don't bundle the dialog.
export const returnSpring = {
  type: "spring" as const,
  stiffness: 380,
  damping: 34,
  mass: 0.9,
};
