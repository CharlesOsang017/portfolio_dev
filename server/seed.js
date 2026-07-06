require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const HomeContent = require('./models/HomeContent');
const Project = require('./models/Project');
const Experience = require('./models/Experience');
const Skill = require('./models/Skill');
const Contact = require('./models/Contact');
const Inquiry = require('./models/Inquiry');

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    console.log("Clearing the database...")
    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      HomeContent.deleteMany({}),
      Project.deleteMany({}),
      Experience.deleteMany({}),
      Skill.deleteMany({}),
      Contact.deleteMany({}),
      Inquiry.deleteMany({}),
      // Inquiry.deleteMany({}),

    ]);
    console.log("Database cleared successfully!")
    console.log("Seeding database with new data...")
    // Admin user
    await User.create({
      name: 'Alex Rivers',
      email: 'admin@portfolio.dev',
      password: 'Admin@1234',
      role: 'admin',
    });

    // Home content
    await HomeContent.create({
      mainHeadline: "Hello, I'm Alex Rivers",
      subHeadline: 'A Senior Software Engineer specializing in crafting high-performance distributed systems and elegant user interfaces. I bridge the gap between complex backend architecture and seamless human interaction.',
      isAvailable: true,
      metrics: { projectsCompleted: 48, yearsExperience: 12, openSourceContribs: 156, happyClients: 32 },
      portfolioViews: 2400,
    });

    // Projects
    await Project.create([
      {
        title: 'Quantum Ledger Infrastructure',
        category: 'Infrastructure / DevOps',
        techStack: ['Rust', 'gRPC', 'AWS'],
        description: 'Building a high-throughput, fault-tolerant consensus layer for distributed financial ledgers. Focused on optimizing gRPC communication overhead and implementing a custom memory-safe Rust implementation of the Raft algorithm.',
        isFeatured: true,
        isPublished: true,       
        isInternal: false,
        githubUrl: 'https://github.com',
        liveUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT16HTGbqH3KYrQES598tZM6i-KcrDmstBSehkf_DbJ-NeOqPxV-PfUpf0C&s=10',
        heroImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT16HTGbqH3KYrQES598tZM6i-KcrDmstBSehkf_DbJ-NeOqPxV-PfUpf0C&s=10',
      },
      {
        title: 'AI-Driven Dashboard Platform',
        category: 'Web Development',
        techStack: ['React', 'Python', 'TensorFlow', 'PostgreSQL'],
        description: 'A real-time analytics dashboard powered by machine learning models for predictive insights.',
        isFeatured: true,
        isPublished: true,     
        isInternal: false,
        githubUrl: 'https://github.com',
        liveUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT16HTGbqH3KYrQES598tZM6i-KcrDmstBSehkf_DbJ-NeOqPxV-PfUpf0C&s=10',
        heroImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT16HTGbqH3KYrQES598tZM6i-KcrDmstBSehkf_DbJ-NeOqPxV-PfUpf0C&s=10',
      },
      {
        title: 'Open Source UI Library',
        category: 'Frontend',
        techStack: ['TypeScript', 'React', 'Storybook', 'Rollup'],
        description: 'A comprehensive, accessible component library with 150+ components and 2k+ GitHub stars.',
        isFeatured: false,
        isPublished: true,
        isInternal: false,
        githubUrl: 'https://github.com',
        liveUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT16HTGbqH3KYrQES598tZM6i-KcrDmstBSehkf_DbJ-NeOqPxV-PfUpf0C&s=10',
        heroImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT16HTGbqH3KYrQES598tZM6i-KcrDmstBSehkf_DbJ-NeOqPxV-PfUpf0C&s=10',
      },
      {
        title: 'Real-Time Collaboration Engine',
        category: 'Backend',
        techStack: ['Node.js', 'WebSockets', 'Redis', 'CRDTs'],
        description: 'A conflict-free replicated data type based engine for real-time collaborative editing.',
        isFeatured: true,
        isPublished: true,
        isInternal: false,
        githubUrl: 'https://github.com',
        liveUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT16HTGbqH3KYrQES598tZM6i-KcrDmstBSehkf_DbJ-NeOqPxV-PfUpf0C&s=10',
        heroImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT16HTGbqH3KYrQES598tZM6i-KcrDmstBSehkf_DbJ-NeOqPxV-PfUpf0C&s=10',
      },
    ]);

    // Experience
    await Experience.create([
      {
        jobTitle: 'Senior Software Engineer',
        company: 'TechStream Solutions',
        location: 'San Francisco, CA',
        startDate: '2021-03',
        endDate: null,
        isPresent: true,
        responsibilities: [
          'Led a team of 12 engineers to refactor core monolith into microservices, reducing latency by 40%.',
          'Implemented an automated CI/CD pipeline using GitHub Actions and AWS ECS.',
          'Designed and shipped a real-time notification system serving 500k+ daily active users.',
        ],       
      },
      {
        jobTitle: 'Full Stack Developer',
        company: 'Creative Logic Agency',
        location: 'Remote',
        startDate: '2018-06',
        endDate: '2021-02',
        isPresent: false,
        responsibilities: [
          'Developed responsive web applications using React, Node.js, and MongoDB.',
          'Built REST APIs consumed by mobile and web clients with 99.9% uptime.',
        ],
      },
      {
        jobTitle: 'Software Engineer',
        company: 'Creative Logic Agency',
        location: 'Remote',
        startDate: '2018-06',
        endDate: '2021-02',
        isPresent: false,
        responsibilities: [
          'Developed responsive web applications using React, Node.js, and MongoDB.',
          'Built REST APIs consumed by mobile and web clients with 99.9% uptime.',
        ],
      },
      {
        jobTitle: 'Software Engineer',
        company: 'Creative Logic Agency',
        location: 'Remote',
        startDate: '2018-06',
        endDate: '2021-02',
        isPresent: false,
        responsibilities: [
          'Developed responsive web applications using React, Node.js, and MongoDB.',
          'Built REST APIs consumed by mobile and web clients with 99.9% uptime.',
        ],
      },
      {
        jobTitle: 'Software Engineer',  
        company: 'Creative Logic Agency',
        location: 'Remote',
        startDate: '2018-06',
        endDate: '2021-02',
        isPresent: false,
        responsibilities: [
          'Developed responsive web applications using React, Node.js, and MongoDB.',
          'Built REST APIs consumed by mobile and web clients with 99.9% uptime.',
        ],
      },
    ]);

    // // Skills
    // await Skill.create([
    //   { name: 'React', category: 'Frontend', proficiency: 95, order: 1 },
    //   { name: 'TypeScript', category: 'Frontend', proficiency: 90, order: 2 },
    //   { name: 'Vue.js', category: 'Frontend', proficiency: 80, order: 3 },
    //   { name: 'Node.js', category: 'Backend', proficiency: 92, order: 1 },
    //   { name: 'Rust', category: 'Backend', proficiency: 75, order: 2 },
    //   { name: 'Python', category: 'Backend', proficiency: 85, order: 3 },
    //   { name: 'MongoDB', category: 'Database', proficiency: 88, order: 1 },
    //   { name: 'PostgreSQL', category: 'Database', proficiency: 83, order: 2 },
    //   { name: 'Redis', category: 'Database', proficiency: 78, order: 3 },
    //   { name: 'Docker', category: 'DevOps', proficiency: 87, order: 1 },
    //   { name: 'AWS', category: 'DevOps', proficiency: 82, order: 2 },
    //   { name: 'Kubernetes', category: 'DevOps', proficiency: 72, order: 3 },
    // ]);

    // Skills
await Skill.create([
  // Programming Languages
  { name: 'JavaScript', category: 'Programming Languages', order: 1 },
  { name: 'TypeScript', category: 'Programming Languages', order: 2 },
  { name: 'SQL', category: 'Programming Languages', order: 3 },
  { name: 'PHP', category: 'Programming Languages', order: 4 },
  { name: 'HCL', category: 'Programming Languages', order: 5 },

  // DevOps & Tools
  { name: 'Docker', category: 'DevOps & Tools', order: 1 },
  { name: 'Git', category: 'DevOps & Tools', order: 2 },
  { name: 'VIM', category: 'DevOps & Tools', order: 3 },
  { name: 'NeoVim', category: 'DevOps & Tools', order: 4 },
  { name: 'Kubernetes', category: 'DevOps & Tools', order: 5 },
  { name: 'Agile', category: 'DevOps & Tools', order: 6 },
  { name: 'CI/CD with Jenkins', category: 'DevOps & Tools', order: 7 },
  { name: 'Terraform', category: 'DevOps & Tools', order: 8 },

  // JavaScript Libraries & Frameworks
  { name: 'Node.js', category: 'JavaScript Libraries & Frameworks', order: 1 },
  { name: 'React.js', category: 'JavaScript Libraries & Frameworks', order: 2 },
  { name: 'Bun.js', category: 'JavaScript Libraries & Frameworks', order: 3 },
  { name: 'Deno', category: 'JavaScript Libraries & Frameworks', order: 4 },
  { name: 'Vanilla JS', category: 'JavaScript Libraries & Frameworks', order: 5 },
  { name: 'Next.js', category: 'JavaScript Libraries & Frameworks', order: 6 },

  // Web Frameworks
  { name: 'Express.js', category: 'Web Frameworks', order: 1 },
  { name: 'Fastify', category: 'Web Frameworks', order: 2 },

  // Backend as a Service
  { name: 'Firebase', category: 'Backend as a Service', order: 1 },
  { name: 'Appwrite', category: 'Backend as a Service', order: 2 },

  // Databases
  { name: 'PostgreSQL', category: 'Databases', order: 1 },
  { name: 'MongoDB', category: 'Databases', order: 2 },
  { name: 'Redis', category: 'Databases', order: 3 },

  // Testing
  { name: 'Jest', category: 'Testing', order: 1 }
]);

    // Contact
    await Contact.create({
      email: 'alex.engineer@portfolio.dev',
      location: 'San Francisco, CA',
      linkedinUrl: 'linkedin.com/in/alexengineer',
      githubUrl: 'github.com/alex-dev',
      availability: 'selective',
      customStatusMessage: 'Accepting new frontend contracts for Q4...',
      timezone: 'America/Los_Angeles',
    });

    // Sample Inquiries
    await Inquiry.create([
      {
        senderName: 'Sarah Jenkins',
        senderEmail: 'sarah@fintech-inc.com',
        subject: 'Frontend Infrastructure Contract',
        message: 'Hi Alex, we have a long-term contract opportunity for a senior frontend engineer...',
        status: 'unread',
        createdAt: new Date('2024-10-24T14:32:00Z'),
      },
      {
        senderName: 'Michael Chen',
        senderEmail: 'm.chen@venture-studio.io',
        subject: 'Collaboration on AI-Driven Dashboard',
        message: 'Hello! I saw your portfolio and would love to discuss a collaboration...',
        status: 'replied',
        createdAt: new Date('2024-10-22T09:15:00Z'),
      },
      {
        senderName: 'Elena Rodriguez',
        senderEmail: 'elena.r@designsystem.co',
        subject: 'Feedback on Open Source Library',
        message: 'Great work on the component library! I had some feedback to share...',
        status: 'archived',
        createdAt: new Date('2024-10-21T18:45:00Z'),
      },
    ]);
    console.log('Database seeded successfully!');
    console.log('Admin credentials: admin@portfolio.dev / Admin@1234');
    mongoose.disconnect();
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
};

seed();
