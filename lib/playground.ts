// The playground's components: one entry per showcase page. Shared by the
// home page's Playground section and each page's social preview image.
export const playgroundItems = [
  {
    id: "container-morph",
    name: "Container Morph",
    meta: "Morphing payment flow",
    href: "/playground/container-morph",
  },
  {
    id: "dropdown",
    name: "Dropdown",
    meta: "Animated select",
    href: "/playground/dropdown",
  },
  {
    id: "multistate-button",
    name: "Multistate Button",
    meta: "Stateful action button",
    href: "/playground/multistate-button",
  },
  {
    id: "slider",
    name: "Slider",
    meta: "Magnetic range control",
    href: "/playground/slider",
  },
] as const;

export type PlaygroundId = (typeof playgroundItems)[number]["id"];
