import {Variants} from "motion";

export const containerVariants: Variants = {
    hidden: {
        y: 20,
        opacity: 0
    },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            duration: 0.5,
            staggerChildren: 0.1,
            delayChildren: 0.2,
        }
    }
};

// Shared layoutId between a playground row name and its showcase page title —
// the element that morphs across the route change. Lives in this plain module
// so server components (the playground pages) can build the id too.
export const playgroundMorphId = (id: string) => `playground-morph-${id}`;

// One-shot sessionStorage flag: set when a showcase page mounts, consumed by
// the home sections on the next home mount (see useHomeEntrance). It marks
// the visit as a return via back-navigation, so the homepage renders already
// settled — entrances only play on a hard load or refresh — and the showcase
// title has a fully visible row to morph back into.
export const HOME_RETURN_FLAG = "home-return";

export const itemVariants: Variants = {
    hidden: {
        opacity: 0,
        filter: "blur(10px)"
    },
    visible: {
        opacity: 1,
        filter: "blur(0px)",
        transition: {
            duration: 0.5,
            type: "spring" as const,
            filter: {
                duration: 0.5,
            }
        }
    }
};