export const TILE_SIZE = 32;
export const GRID_COLS = 44;
export const GRID_ROWS = 24;

export const MAP_IMAGE_SRC = "/map.png";
export const PLAYER_SPRITE_SHEET_SRC = "/player.png";

export const PLAYER_SPRITE_FRAME_W = 256;
export const PLAYER_SPRITE_FRAME_H = 256;
export const PLAYER_SPRITE_FRAMES_PER_ROW = 4;

export const PLAYER_RENDER_W = 84;
export const PLAYER_RENDER_H = 84;

export const NAV_ZONE_RADIUS_PX = 110;

export const WORLD_W = GRID_COLS * TILE_SIZE;
export const WORLD_H = GRID_ROWS * TILE_SIZE;

export const EDGE_MARGIN_PX = 12;

export const PLAYER_SPRITE_FPS = 8;

export const PLAYER_SPRITE_ROW_BY_DIR = {
  down: 0,
  left: 2,
  right: 1,
  up: 3,
} as const;

export const TAGS = [
  "LLM Systems",
  "MLOps",
  "Full-Stack",
  "React/Next.js",
  "Python",
  "Agentic AI",
  "Kubernetes",
  "FastAPI",
];

export const experiences = [
  {
    role: "ML Engineer Co-op",
    company: "Royal Bank of Canada (RBC)",
    location: "Mississauga, ON",
    period: "Sept 2025 – Dec 2025",
    bullets: [
      "Designed, implemented, and deployed a production-grade API serving a smoker-risk ML model for automated underwriting and risk assessment, projected to save $5M annually.",
      "Implemented LLM-as-a-Judge frameworks with W&B and ELK Stack to monitor model drift and hallucination rates in real-time production environments.",
      "Optimized CI/CD pipelines using GitHub Actions, Docker, and Kubernetes for ML service deployments across multi-cloud OpenShift environments.",
    ],
  },
  {
    role: "ML Engineer Co-op",
    company: "Royal Bank of Canada (RBC)",
    location: "Mississauga, ON",
    period: "Jan 2025 – Apr 2025",
    bullets: [
      "Engineered an Agentic AI platform using LangGraph and an MCP server to orchestrate natural-language-to-SQL querying over Snowflake with a React dashboard, reducing manual SQL effort by 70%.",
      "Developed an autonomous testing agent using LangGraph to dynamically generate and execute JUnit, Spock, and Cucumber test cases for production-grade LLM services.",
      "Architected a Python FastAPI/Uvicorn backend for real-time LLM inference, optimizing request throughput by 40% with monitoring for model drift and hallucination.",
      "Built batch-parallelized Apache Airflow DAGs for Next Best Action ML pipelines, enabling scalable insurance claims scoring and microservice migration.",
    ],
  },
  {
    role: "Software Development Engineer Co-op",
    company: "Pragmatica Inc.",
    location: "Remote",
    period: "May 2024 – Aug 2024",
    bullets: [
      "Developed core VR features in C# and Unity, implementing an FSM to handle complex logic for 40+ linguistic-focused therapeutic activities.",
      "Enhanced the analytics dashboard using React and Firebase, enabling real-time data synchronization and visualization for clinicians and administrators.",
      "Optimized C# scripts and environment assets, improving headset frame rates by 15%.",
    ],
  },
  {
    role: "ML Developer",
    company: "Actionable Inc.",
    location: "Remote",
    period: "Jun 2022 – Nov 2023",
    bullets: [
      "Architected a multi-stage NLP pipeline using Hugging Face Transformers and OpenAI APIs to scale sentiment analysis and text summarization across 250k+ data points, achieving an 87% success rate for executive-level insights.",
    ],
  },
  {
    role: "Research Assistant",
    company: "Behavior Analytics and Modeling Lab, University of Waterloo",
    location: "Remote",
    period: "May 2021 – Aug 2024",
    bullets: [
      "Built a case management tool using React, Node.js, and MySQL to visualize 1M+ historical data points for investigators at the Chicago PD, reducing data ingestion time by 40%.",
      "Analyzed city-scale datasets using R and Python to identify patterns and support research on urban technology and policy.",
    ],
  },
];

export const projects = [
  {
    title: "GroceryDash Game",
    stack: "Unity · C#",
    href: "https://github.com/vavaviper/windowdash",
    bullets: [
      "Built in 48 hrs at Waterloo Game Jam - FSM-driven car/player mechanics, weight-based inventory, and timed order fulfillment loops.",
      "Engineered event-driven systems for scoring, timers, UI menus, and multi-level progression with scaling difficulty.",
    ],
  },
  {
    title: "Candid",
    stack: "Next.js 15 · Tailwind CSS · Express.js",
    href: "https://bereal-dupe.vercel.app/",
    bullets: [
      "BeReal-style event platform where organizers create access-code or geolocation-locked events and fire time-limited photo prompts.",
      "Attendees capture and submit photos that stream onto a live masonry canvas with 30s polling; full organizer dashboard for prompt management.",
    ],
  },
  {
    title: "EstateFinder",
    stack: "React · Express.js · Node.js · MongoDB · Tailwind CSS · Scikit-Learn",
    href: "https://github.com/vavaviper/real-estate",
    bullets: [
      "Full-stack marketplace with secure JWT and Google OAuth authentication, real-time CRUD, and Firebase image uploads.",
      "Scikit-Learn regression model for price estimation; advanced search filters and dynamic Tailwind UI components.",
    ],
  },
  {
    title: "Neural Network from Scratch",
    stack: "Python · NumPy · Matplotlib",
    href: "https://github.com/vavaviper/neural_network_from_scratch-main",
    bullets: [
      "Built a fully-connected neural network from scratch using only NumPy, implementing backpropagation, ReLU, Softmax, and cross-entropy loss.",
      "Achieved ~96.7% test accuracy on MNIST digit classification and visualized training loss over 20 epochs.",
    ],
  },
  {
    title: "Employee Management Microservice",
    stack: "Java · Spring Boot · PostgreSQL · Spring AOP",
    href: "https://github.com/vavaviper/ems",
    bullets: [
      "Built a Spring Boot + PostgreSQL CRUD service with Spring AOP for automated audit trails and JPQL aggregations for real-time org analytics.",
      "Integrated OpenAPI/Swagger and Spring Actuator to automate documentation and system health monitoring.",
    ],
  }
];
