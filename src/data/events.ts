import type { Event } from "@/types";

export const events: Event[] = [
    // Concerts
    {
        id: "concert-1",
        name: "Aurora Nights Tour",
        description:
            "Experience an unforgettable evening with one of the most captivating voices in modern music. The Aurora Nights Tour brings ethereal melodies and stunning visuals together for a concert experience unlike any other. Join thousands of fans for this landmark performance.",
        date: "2026-03-15",
        time: "8:00 PM",
        venue: "Madison Square Garden",
        location: "New York, NY",
        image: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800&h=600&fit=crop",
        category: "Concerts",
        ticketTypes: [
            { id: "concert-1-ga", name: "General Admission", price: 40, available: 500 },
            { id: "concert-1-floor", name: "Floor Seats", price: 75, available: 200 },
            { id: "concert-1-vip", name: "VIP Package", price: 120, available: 50 },
        ],
    },
    {
        id: "concert-2",
        name: "Jazz Under the Stars",
        description:
            "An intimate evening of world-class jazz featuring Grammy-winning artists in a stunning outdoor amphitheater setting. Bring a blanket, enjoy fine wine, and let the smooth sounds of saxophone and piano transport you under the starlit sky.",
        date: "2026-04-22",
        time: "7:30 PM",
        venue: "Hollywood Bowl",
        location: "Los Angeles, CA",
        image: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800&h=600&fit=crop",
        category: "Concerts",
        ticketTypes: [
            { id: "concert-2-lawn", name: "Lawn Seating", price: 25, available: 1000 },
            { id: "concert-2-reserved", name: "Reserved Seating", price: 45, available: 400 },
            { id: "concert-2-box", name: "Box Seats", price: 85, available: 60 },
        ],
    },
    {
        id: "concert-3",
        name: "Electric Pulse Festival",
        description:
            "Three days of non-stop electronic music featuring the biggest names in EDM. Multiple stages, immersive light shows, and an energy that will keep you dancing from sunset to sunrise. This is the festival experience you've been waiting for.",
        date: "2026-05-08",
        time: "4:00 PM",
        venue: "Las Vegas Motor Speedway",
        location: "Las Vegas, NV",
        image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=600&fit=crop",
        category: "Concerts",
        ticketTypes: [
            { id: "concert-3-single", name: "Single Day Pass", price: 65, available: 5000 },
            { id: "concert-3-weekend", name: "Weekend Pass", price: 150, available: 3000 },
            { id: "concert-3-vip", name: "VIP Weekend", price: 295, available: 500 },
        ],
    },
    {
        id: "concert-4",
        name: "Acoustic Sessions Live",
        description:
            "An intimate stripped-down performance featuring beloved hits reimagined in their purest form. This rare acoustic showcase brings you closer to the music in a historic theater setting with exceptional sound quality.",
        date: "2026-06-12",
        time: "7:00 PM",
        venue: "Ryman Auditorium",
        location: "Nashville, TN",
        image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop",
        category: "Concerts",
        ticketTypes: [
            { id: "concert-4-balcony", name: "Balcony", price: 30, available: 300 },
            { id: "concert-4-orchestra", name: "Orchestra", price: 55, available: 150 },
            { id: "concert-4-front", name: "Front Row", price: 95, available: 20 },
        ],
    },

    // Sports
    {
        id: "sports-1",
        name: "Lakers vs. Celtics",
        description:
            "The NBA's greatest rivalry returns! Watch the Los Angeles Lakers battle the Boston Celtics in what promises to be an electrifying matchup. Championship banners hang overhead as two of basketball's most storied franchises clash on the hardwood.",
        date: "2026-03-28",
        time: "7:30 PM",
        venue: "Crypto.com Arena",
        location: "Los Angeles, CA",
        image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&h=600&fit=crop",
        category: "Sports",
        ticketTypes: [
            { id: "sports-1-upper", name: "Upper Level", price: 35, available: 800 },
            { id: "sports-1-lower", name: "Lower Level", price: 90, available: 400 },
            { id: "sports-1-courtside", name: "Courtside", price: 400, available: 40 },
        ],
    },
    {
        id: "sports-2",
        name: "World Series Game 7",
        description:
            "Baseball's ultimate showdown. The decisive Game 7 of the World Series where legends are made and history is written. Witness the drama, the tension, and the glory of America's pastime at its absolute peak.",
        date: "2026-10-30",
        time: "8:00 PM",
        venue: "Yankee Stadium",
        location: "Bronx, NY",
        image: "https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=800&h=600&fit=crop",
        category: "Sports",
        ticketTypes: [
            { id: "sports-2-bleacher", name: "Bleacher Seats", price: 120, available: 1500 },
            { id: "sports-2-field", name: "Field Level", price: 265, available: 600 },
            { id: "sports-2-premium", name: "Premium Club", price: 580, available: 100 },
        ],
    },
    {
        id: "sports-3",
        name: "NFL Sunday Night Football",
        description:
            "Prime time football at its finest. Two playoff-contending teams battle under the lights in a game that could decide home-field advantage. Tailgate with fellow fans, feel the roar of the crowd, and experience the intensity of NFL football.",
        date: "2026-11-15",
        time: "8:20 PM",
        venue: "AT&T Stadium",
        location: "Arlington, TX",
        image: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=800&h=600&fit=crop",
        category: "Sports",
        ticketTypes: [
            { id: "sports-3-endzone", name: "End Zone", price: 45, available: 2000 },
            { id: "sports-3-sideline", name: "Sideline", price: 110, available: 1000 },
            { id: "sports-3-club", name: "Club Level", price: 220, available: 300 },
        ],
    },
    {
        id: "sports-4",
        name: "US Open Tennis Finals",
        description:
            "The grand finale of the US Open Tennis Championship. Watch the world's best tennis players compete for the prestigious title in Arthur Ashe Stadium. Experience the athleticism, drama, and tradition of Grand Slam tennis.",
        date: "2026-09-13",
        time: "4:00 PM",
        venue: "Arthur Ashe Stadium",
        location: "Flushing, NY",
        image: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=800&h=600&fit=crop",
        category: "Sports",
        ticketTypes: [
            { id: "sports-4-promenade", name: "Promenade", price: 85, available: 800 },
            { id: "sports-4-loge", name: "Loge", price: 170, available: 500 },
            { id: "sports-4-courtside", name: "Courtside Box", price: 460, available: 50 },
        ],
    },

    // Theater
    {
        id: "theater-1",
        name: "Phantom of the Opera",
        description:
            "The longest-running show in Broadway history returns for a limited engagement. Experience the timeless tale of obsession, romance, and music in Andrew Lloyd Webber's masterpiece. The chandelier, the mask, the music—pure theatrical magic.",
        date: "2026-04-05",
        time: "8:00 PM",
        venue: "Majestic Theatre",
        location: "New York, NY",
        image: "https://images.unsplash.com/photo-1507924538820-ede94a04019d?w=800&h=600&fit=crop",
        category: "Theater",
        ticketTypes: [
            { id: "theater-1-rear", name: "Rear Mezzanine", price: 45, available: 200 },
            { id: "theater-1-mezz", name: "Front Mezzanine", price: 75, available: 150 },
            { id: "theater-1-orchestra", name: "Orchestra", price: 110, available: 100 },
        ],
    },
    {
        id: "theater-2",
        name: "Hamilton",
        description:
            "The revolutionary musical that changed Broadway forever. Lin-Manuel Miranda's hip-hop infused retelling of Alexander Hamilton's life is a cultural phenomenon. Don't throw away your shot to see this groundbreaking production.",
        date: "2026-05-20",
        time: "7:00 PM",
        venue: "Richard Rodgers Theatre",
        location: "New York, NY",
        image: "https://images.unsplash.com/photo-1503095396549-807759245b35?w=800&h=600&fit=crop",
        category: "Theater",
        ticketTypes: [
            { id: "theater-2-balcony", name: "Balcony", price: 85, available: 180 },
            { id: "theater-2-mezz", name: "Mezzanine", price: 145, available: 120 },
            { id: "theater-2-premium", name: "Premium Orchestra", price: 215, available: 60 },
        ],
    },
    {
        id: "theater-3",
        name: "Stand-Up Showcase",
        description:
            "An evening of non-stop laughter featuring five of comedy's brightest stars. From observational humor to absurdist bits, this showcase brings together diverse comedic styles for one unforgettable night. Warning: your abs may hurt from laughing.",
        date: "2026-06-08",
        time: "9:00 PM",
        venue: "The Comedy Store",
        location: "West Hollywood, CA",
        image: "https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=800&h=600&fit=crop",
        category: "Theater",
        ticketTypes: [
            { id: "theater-3-ga", name: "General Admission", price: 15, available: 150 },
            { id: "theater-3-booth", name: "Booth Seating", price: 25, available: 40 },
            { id: "theater-3-front", name: "Front Row", price: 35, available: 20 },
        ],
    },
    {
        id: "theater-4",
        name: "Shakespeare in the Park",
        description:
            "A Midsummer Night's Dream comes to life in Central Park's Delacorte Theater. This beloved tradition brings world-class Shakespeare performances to an open-air setting under the summer stars. Magic, mischief, and romance await.",
        date: "2026-07-18",
        time: "8:00 PM",
        venue: "Delacorte Theater",
        location: "New York, NY",
        image: "https://images.unsplash.com/photo-1516307365426-bea591f05011?w=800&h=600&fit=crop",
        category: "Theater",
        ticketTypes: [
            { id: "theater-4-lawn", name: "Lawn", price: 15, available: 400 },
            { id: "theater-4-reserved", name: "Reserved", price: 30, available: 200 },
            { id: "theater-4-premium", name: "Premium", price: 45, available: 80 },
        ],
    },
];

export const getEventById = (id: string): Event | undefined => {
    return events.find((event) => event.id === id);
};

export const getEventsByCategory = (category: Event["category"]): Event[] => {
    return events.filter((event) => event.category === category);
};

export const getFeaturedEvents = (count: number = 4): Event[] => {
    return events.slice(0, count);
};

export const categories: Event["category"][] = ["Concerts", "Sports", "Theater"];
