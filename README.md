# Ersti Hilfe Kit

A comprehensive digital orientation platform for freshmen at the **Technische Hochschule Ingolstadt (THI)**. This interactive web application provides virtual city and campus tours, study guides, and an engaging scavenger hunt to help new students get familiar with their university and surroundings.

## ✨ Features

### 🗺️ Interactive Virtual Tours

- **Campus Tour**: Interactive maps with video content showcasing university buildings and facilities
- **City Tour**: Explore Ingolstadt and Neuburg with location-based multimedia content
- **MapLibre GL integration** for smooth, responsive map experiences

### 📚 Comprehensive Study Guides

- **Campus Navigation**: Building layouts, room finding, and facility information
- **Study Life**: Academic procedures, important dates, and university regulations
- **Student Life**: Dining options, recreational activities, and student organizations
- **Glossary**: A-Z guide of important terms and concepts

### 🎯 Digital Scavenger Hunt

- **QR Code-based gameplay**: Scan codes around campus to earn points
- **Interactive quizzes**: Answer questions about locations for bonus points
- **Progress tracking**: Real-time score updates and leaderboards
- **Offline storage**: Uses IndexedDB for persistent progress tracking

### 🌐 Multi-language Support

- German and English content support
- Internationalization-ready architecture

### 📱 Modern Web Technologies

- **Responsive design**: Works seamlessly on desktop and mobile devices
- **Progressive Web App**: Can be installed on mobile devices
- **Dark/Light theme**: Automatic theme switching based on user preference
- **Accessibility**: Built with accessibility best practices

## 🚀 Tech Stack

- **Frontend**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Radix UI primitives with custom styling
- **Maps**: MapLibre GL for interactive mapping
- **Data Storage**: IndexedDB for client-side persistence
- **Build Tool**: Bun for fast package management and builds
- **Deployment**: Docker with standalone output

## 🏗️ Architecture

```text
├── components/          # Reusable UI components
│   ├── guide/          # Guide-specific components
│   ├── map/            # Map-related components
│   ├── tour/           # Tour functionality
│   └── ui/             # Base UI components
├── data/               # Content data (JSON files)
│   ├── guide/          # Study guide content
│   ├── scavenger/      # Scavenger hunt locations (Markdown)
│   └── tour/           # Tour locations and multimedia
├── lib/                # Utility functions and data processing
├── pages/              # Next.js pages and API routes
├── public/             # Static assets
└── styles/             # Global CSS styles
```

## 🛠️ Development

### Prerequisites

- [Bun](https://bun.sh/)

### Quick Start

1. **Clone the repository**

   ```bash
   git clone https://github.com/neuland-ingolstadt/ersti-hilfe-kit.git
   cd ersti-hilfe-kit
   ```

2. **Install dependencies**

   ```bash
   bun install
   ```

3. **Start development server**

   ```bash
   bun dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

```bash
bun run dev       # Start development server
bun run build     # Build for production
bun run start     # Start production server
bun run lint      # Run TypeScript and Biome checks
bun run fmt       # Format code with Biome
```

### Environment Variables

Create a `.env.local` file for development:

```env
NEXT_PUBLIC_NEULAND_GRAPHQL_ENDPOINT=https://api.neuland.app/graphql
NEXT_PUBLIC_APTABASE_KEY=your_aptabase_key
SCAVENGER_HUNT_DISABLED=false
```

## 🐳 Deployment

### Docker Deployment

The application is designed for containerized deployment with Docker:

```dockerfile
# Build and run with Docker
docker build -t ersti-hilfe-kit .
docker run -p 3000:3000 ersti-hilfe-kit
```

### Docker Compose

For production deployment with Traefik:

```yaml
version: "3"

services:
  app:
    build:
      context: ./ersti-hilfe-kit
      dockerfile: Dockerfile
    restart: always
    init: true
    environment:
      - TZ=Europe/Berlin
      - NEXT_PUBLIC_NEULAND_GRAPHQL_ENDPOINT=https://api.neuland.app/graphql
    networks:
      - web
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.ophase.rule=Host(`ersti.neuland.app`)"
      - "traefik.http.routers.ophase.entrypoints=https"
      - "traefik.http.routers.ophase.tls=true"
      - "traefik.http.routers.ophase.tls.certresolver=le"

networks:
  web:
    external: true
```

## 📊 Content Management

### Adding Tour Locations

1. Add video content to your CDN/storage
2. Generate poster images:

   ```bash
   for i in *.mp4; do ffmpeg -i "$i" -vframes 1 -vf scale=1280:720 "../poster/$(basename "$i" .mp4).jpg"; done
   ```

3. Update `data/tour/[city].json` with new locations

### Creating Scavenger Hunt Content

1. Create markdown files in `data/scavenger/`
2. Include frontmatter with points and questions:

   ```markdown
   ---
   heading: "Location Name"
   points: 10
   questions:
     - id: "q1"
       points: 5
       question: "What year was this building constructed?"
       answer: ["1995", "nineteen ninety-five"]
   ---
   
   # Location Description
   
   Your location content here...
   ```

### Video Transcoding

For optimal performance, transcode videos to web-friendly formats:

```bash
# Transcode videos to H.264 720p
for i in *.mp4; do 
  ffmpeg -i "$i" -c:a copy -c:v libx264 -vf scale=1280:720 "../web/$i"
done
```

## 🤝 Contributing

We welcome contributions from the community! Whether you're a student, faculty member, or developer, there are many ways to help:

### How to Contribute

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Contribution Areas

- **Content**: Add or update study guides, tour locations, and scavenger hunt challenges
- **Translations**: Help translate content to additional languages
- **Features**: Implement new functionality or improve existing features
- **Bug Fixes**: Report and fix issues
- **Documentation**: Improve documentation and add examples

### Development Guidelines

- Follow the existing code style (enforced by Biome)
- Write meaningful commit messages
- Test your changes thoroughly
- Update documentation as needed

## 👥 Authors & Acknowledgments

**Developed by:**

- [Fachschaft Informatik THI](https://studverthi.de) - Student representatives for Computer Science
- [Neuland Ingolstadt e.V.](https://neuland-ingolstadt.de/) - Student organization for digital innovation

**Inspired by:**

- [Fachschaft Wiwi, University of Göttingen](https://hochschulforumdigitalisierung.de/de/blog/o-phase-online) - Campus tour concept
- [StuV OTH Regensburg](https://stuv.othr.de/dein-studienguide/) - Study guide structure

**Special Thanks:**

- All student volunteers who contributed content and testing
- THI administration for supporting digital innovation
- The open-source community for the amazing tools and libraries

## 📄 License

This project is licensed under the **GNU Affero General Public License v3.0** - see the [LICENSE.md](LICENSE.md) file for details.

> [!IMPORTANT]  
> **Content Licensing**: The `/data` folder containing educational content, images, and multimedia is **not covered** by the AGPL-3.0 license and may have separate licensing terms.

### Why AGPL-3.0?

We chose AGPL-3.0 to ensure that:

- The software remains open source even when deployed as a web service
- Improvements and modifications are shared back with the community
- Educational institutions can freely use and adapt the platform

## 🔗 Related Projects

- [Neuland Next App](https://github.com/neuland-ingolstadt/neuland.app-native) - Native mobile app for THI students
- [Neuland.App](https://neuland.app) - Web-based student portal
- [THI API](https://github.com/neuland-ingolstadt/neuland.app) - University data API
