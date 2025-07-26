// Container sa stagger animacijom
export const containerVariants = {
    hidden: {
        y: 20,
        opacity: 0
    },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            duration: 0.5,
            staggerChildren: 0.1, // delay između elemenata
            delayChildren: 0.2,   // početni delay
        }
    }
};

export const itemVariants = {
    hidden: {
        opacity: 0,
        filter: "blur(0.5em)",
    },
    visible: {
        opacity: 1,
        filter: "blur(0px)",
        transition: {
            duration: 0.25,
            type: 'spring',
            filter: {
                duration: 0.5,
            }
        }
    }
};
