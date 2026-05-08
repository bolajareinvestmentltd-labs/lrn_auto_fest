export interface Champion {
    id: string;
    name: string;
    title: string;
    image: string;
    bio: string;
    instagram?: string;
    twitter?: string;
    tiktok?: string;
}

export interface CategoryChampions {
    categoryId: string;
    categoryName: string;
    champions: Champion[];
}

export const allChampions: CategoryChampions[] = [
    {
        categoryId: "driftChampionship",
        categoryName: "Drift Championship",
        champions: [
            {
                id: "drift-1",
                name: "Mohammed Lexus",
                title: "",
                image: "/images/champions/mohammed-lexus.PNG",
                bio: "",
                instagram: "https://www.instagram.com/mohammed_lexus/",
            },
            {
                id: "drift-3",
                name: "Real Sam",
                title: "",
                image: "/images/champions/real-sam.png",
                bio: "",
                instagram: "https://www.instagram.com/realsam09/",
            },
            {
                id: "drift-2",
                name: "Ameer Bulama",
                title: "",
                image: "/images/champions/ameer-bulama.jpeg",
                bio: "",
                instagram: "https://www.instagram.com/ameerr_bulama/",
            },
        ],
    },
    {
        categoryId: "dragRace",
        categoryName: "Drag Race",
        champions: [
            {
                id: "drag-1",
                name: "Kingsley Obi",
                title: "2025 Drag Champion",
                image: "/images/champions/kingsley-obi.jpeg",
                bio: "Fastest drag racer in Northern Nigeria. Average quarter-mile: 11.2 seconds.",
                instagram: "@kingsley_dragking",
                twitter: "@KingsleyDrag",
                tiktok: "@KingsleyDragRace",
            },
            {
                id: "drag-2",
                name: "Chioma Uche",
                title: "Speed Queen",
                image: "/images/champions/chioma-uche.jpeg",
                bio: "Multiple-time drag race winner with exceptional launch control.",
                instagram: "@chioma_speedqueen",
                twitter: "@ChiomaSpeed",
                tiktok: "@ChiomaSpeedQueen",
            },
            {
                id: "drag-3",
                name: "Emeka Nwosu",
                title: "Consistent Performer",
                image: "/images/champions/emeka-nwosu.jpeg",
                bio: "Known for reliability and consistent performance in competitive racing.",
                instagram: "@emeka_dragmaster",
                twitter: "@EmekaDrag",
                tiktok: "@EmekaDragMaster",
            },
            {
                id: "drag-4",
                name: "Adeola Bello",
                title: "Track Specialist",
                image: "/images/champions/adeola-bello.jpeg",
                bio: "Expert in track conditions and tuning for optimal drag race performance.",
                instagram: "@adeola_trackking",
                twitter: "@AdeolaDrag",
                tiktok: "@AdeolaDragTrack",
            },
        ],
    },
    {
        categoryId: "bestBuild",
        categoryName: "Best Build",
        champions: [
            {
                id: "build-1",
                name: "Ahmed Kareem",
                title: "Best Build Master",
                image: "/images/champions/ahmed-kareem.jpg",
                bio: "Expert car builder and customizer. Specializes in aesthetic modifications and performance tuning.",
                instagram: "@ahmed_buildmaster",
                twitter: "@AhmedBuild",
                tiktok: "@AhmedBuildKing",
            },
            {
                id: "build-2",
                name: "Blessing Okonkwo",
                title: "Design Innovator",
                image: "/images/champions/blessing-okonkwo.jpg",
                bio: "Creative genius in car design. Known for unique and eye-catching builds.",
                instagram: "@blessing_design",
                twitter: "@BlessingBuild",
                tiktok: "@BlessingDesignCar",
            },
            {
                id: "build-3",
                name: "Solomon Adeniyi",
                title: "Classic Restorer",
                image: "/images/champions/solomon-adeniyi.jpg",
                bio: "Specialist in restoring classic cars while maintaining modern performance standards.",
                instagram: "@solomon_classic",
                twitter: "@SolomonRestore",
                tiktok: "@SolomonClassic",
            },
            {
                id: "build-4",
                name: "Grace Okafor",
                title: "Luxury Specialist",
                image: "/images/champions/grace-okafor.jpg",
                bio: "Expert in luxury car customization and premium interior modifications.",
                instagram: "@grace_luxury",
                twitter: "@GraceLuxury",
                tiktok: "@GraceLuxuryCar",
            },
        ],
    },
];

export function getChampionsByCategory(categoryId: string): Champion[] {
    const category = allChampions.find(cat => cat.categoryId === categoryId);
    return category ? category.champions : [];
}
