export const projects = [
  {
    title: "Chineko Pasal | An eCommerce Platform in Nepal",
    slug: "chineko-pasal",
    tagline:
      "A dynamic eCommerce platform designed to cater to the diverse needs of Nepali users.",
    overview:
      "Chineko Pasal is an innovative eCommerce platform that aims to simplify online shopping in Nepal. It offers a seamless user experience with a modern, responsive UI and features tailored to Nepali audiences. The platform integrates efficient search, smooth navigation, and a robust system to ensure a hassle-free shopping experience.",
    features: [
      "Modern and intuitive UI/UX design",
      "Mobile-responsive and cross-browser compatible",
      "Secure and optimized login and checkout flows",
      "Product zoom and image carousel for detailed product views",
      "Integration with social media sharing and Google Analytics",
    ],
    techStack: [
      "React.js",
      "Next.js",
      "Tailwind CSS",
      "Ant Design",
      "Axios",
      "Framer Motion",
      "Zustand",
    ],
    challenges: [
      "Developing a scalable architecture for high traffic.",
      "Creating a user-friendly interface optimized for Nepali audiences.",
      "Ensuring smooth performance on low-bandwidth networks.",
      "Integrating secure payment and product management features.",
    ],
    learnings: [
      "Designed and developed reusable React components.",
      "Enhanced mobile responsiveness and UX-friendly designs.",
      "Deepened knowledge of integrating third-party libraries effectively.",
      "Gained hands-on experience with performance optimization techniques.",
    ],
    feedback: false,
    links: {
      live: "https://chinekopasal.com",
      github: "",
    },
  },
  {
    title: "Portfolio | Abhishek Ghimire",
    slug: "portfolio",
    tagline:
      "A dynamic portfolio showcasing my projects, skills, and contributions using the latest web technologies.",
    overview:
      "My personal portfolio is built to highlight my journey as a developer. It integrates advanced features like profile views tracking, a love count mechanism, and server-side actions for seamless interactivity and performance.",
    features: [
      "API to track and display profile views in real-time.",
      "Love count feature to allow visitors to express appreciation for the work.",
      "Implemented server actions using the latest Next.js features.",
      "Dynamic project listing with slug-based routing for detailed pages.",
      "Mobile-responsive and optimized for all devices.",
      "Integration with MongoDB using Mongoose for efficient data management.",
    ],
    techStack: [
      "Next.js",
      "React",
      "Mongoose",
      "MongoDB",
      "Tailwind CSS",
      "Radix UI",
      "TypeScript",
    ],
    challenges: [
      "Implementing real-time tracking for profile views efficiently.",
      "Designing and integrating a scalable database schema with Mongoose.",
      "Utilizing server actions for seamless and performant interactions.",
      "Ensuring cross-browser and device compatibility for UI components.",
    ],
    learnings: [
      "Deepened knowledge of Next.js server actions and their use cases.",
      "Gained experience in designing interactive UI components.",
      "Enhanced understanding of MongoDB operations and ORM with Mongoose.",
      "Improved ability to optimize performance for web applications.",
    ],
    feedback: true,
    links: {
      live: "https://abhishekg.com.np",
      github: "https://github.com/cypherab01/abhishekg.com.np",
    },
  },
  {
    title: "bitinfonepal.com | Educational Platform for BIT Students",
    slug: "bitinfonepal",
    tagline:
      "A comprehensive platform for BIT students in Nepal to access educational resources, quizzes, and official notices.",
    overview:
      "bitinfonepal.com is an educational platform tailored for students pursuing a Bachelor's in Information & Technology under Tribhuvan University (TU). It provides an extensive library of past questions, syllabi, and notes, alongside a quiz platform for entrance exam preparation and filtered official notices to keep students informed.",
    features: [
      "Extensive collection of past questions and syllabi.",
      "Notes and learning resources for BIT courses.",
      "Quiz platform for entrance exam preparation.",
      "Filtered notices from the official university website.",
      "User-friendly and responsive design for seamless accessibility.",
    ],
    techStack: [
      "Next.js",
      "React",
      "Tailwind CSS",
      "TypeScript",
      "Nodemailer",
      "PostCSS",
    ],
    challenges: [
      "Organizing and presenting vast educational resources efficiently.",
      "Developing an interactive quiz platform for prospective students.",
      "Ensuring the platform is responsive and accessible across devices.",
      "Filtering and updating notices dynamically from the official source.",
    ],
    learnings: [
      "Improved skills in creating dynamic and responsive web applications.",
      "Gained experience in managing and structuring educational content.",
      "Enhanced knowledge of TypeScript and advanced React patterns.",
      "Learned to implement and optimize notification systems for users.",
    ],
    feedback: true,
    links: {
      live: "https://bitinfonepal.com",
      github: "",
    },
  },
  {
    title: "The Blog | Minimalist Blogging Platform",
    slug: "the-blog",
    tagline:
      "A basic yet powerful blogging platform where admins can post and readers can enjoy content.",
    overview:
      "The Blog is a simple, user-friendly blogging platform where admins can easily post new blogs, and readers can access and read them without needing to log in. The platform supports image and file uploads for blog content, making it easy to create engaging posts. Authentication is managed via Auth.js (NextAuth), ensuring secure admin access.",
    features: [
      "Admin authentication via NextAuth using Auth.js for secure access.",
      "Blog posts can be added, edited, or deleted by admins.",
      "Non-logged-in users can freely read blog posts.",
      "Image and file uploads integrated with UploadThing for blog media.",
      "Responsive and modern UI with Tailwind CSS for seamless reading experience.",
      "Simple and effective blog management for admins.",
    ],
    techStack: [
      "Next.js",
      "React",
      "Tailwind CSS",
      "Mongoose",
      "NextAuth (Auth.js)",
      "UploadThing",
      "Axios",
      "Radix UI",
    ],
    challenges: [
      "Implementing secure admin authentication and session management with NextAuth.",
      "Handling file uploads efficiently using UploadThing.",
      "Ensuring smooth user experience for both admins and readers.",
      "Building a simple and effective blog management system for admins.",
    ],
    learnings: [
      "Gained hands-on experience with admin authentication using NextAuth (Auth.js).",
      "Learned how to integrate file and image uploads in Next.js using UploadThing.",
      "Improved skills in building a content management system (CMS) for blogs.",
      "Developed expertise in creating responsive and user-friendly interfaces with Tailwind CSS.",
    ],
    feedback: true,
    links: {
      live: "https://blog.abhishekg.com.np/",
      github: "https://github.com/cypherab01/the-blog/",
    },
  },
  {
    title: "Notebook | A Simple Note-Taking App",
    slug: "notebook",
    tagline:
      "A straightforward CRUD-based note-taking app designed to learn MongoDB, API creation, and authentication practices.",
    overview:
      "Notebook is a minimalistic note-taking application built as a learning project to explore MongoDB integration, API creation, and implementing authentication and authorization mechanisms. It provides users with a platform to manage their notes securely and efficiently.",
    features: [
      "Create, read, update, and delete notes.",
      "User authentication and authorization using JWT.",
      "Secure password hashing with bcryptjs.",
      "Responsive and clean user interface with Radix UI components.",
      "Theming support with Next.js themes.",
    ],
    techStack: [
      "Next.js",
      "React",
      "Tailwind CSS",
      "Mongoose",
      "JWT",
      "Bcrypt.js",
      "Nodemailer",
    ],
    challenges: [
      "Implementing secure authentication and authorization processes.",
      "Learning MongoDB schema design and integrating it with Mongoose.",
      "Creating robust and efficient RESTful APIs.",
      "Ensuring seamless user experience with a responsive UI.",
    ],
    learnings: [
      "Gained hands-on experience with MongoDB and Mongoose for data management.",
      "Practiced API creation and integration with secure practices.",
      "Enhanced knowledge of implementing authentication and authorization using JWT.",
      "Learned to build reusable and responsive UI components.",
    ],
    feedback: true,
    links: {
      live: "https://notebook.abhishekg.com.np",
      github: "https://github.com/cypherab01/notebook",
    },
  },
];
