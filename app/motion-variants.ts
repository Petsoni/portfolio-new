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
        }
    }
};