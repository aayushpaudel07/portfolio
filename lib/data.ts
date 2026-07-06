export const profile = {
  name: "Aayush Paudel",
  brand: "error_found",
  title: "Cybersecurity Student | Ethical Hacker | Penetration Testing Enthusiast",
  location: "Kawasoti-3, Nawalpur, Nepal",
  email: "aayush.paudel.aayush@gmail.com",
  phone: "+977 9748437970",
  github: "https://github.com/aayushpaudel07",
  githubUsername: "aayushpaudel07",
  linkedin: "https://www.linkedin.com/in/aayush-paudel-7b0227258/",
  resumeUrl: "/resume.pdf",
  bio: "A passionate Cybersecurity student pursuing a Bachelor of Computer Science (Cyber Security Hons.) at Asian Pacific University with a strong interest in offensive security, penetration testing, network defense, and digital forensics. I enjoy solving Capture The Flag (CTF) challenges, exploring Linux systems, building practical cybersecurity projects, and continuously expanding my knowledge through hands-on labs and certifications. My goal is to contribute to securing digital infrastructure while growing into a skilled security professional.",
  experience:
    "Cybersecurity student actively developing practical skills through university projects, security labs, Capture The Flag competitions, and independent research in penetration testing, networking, Linux administration, and digital forensics.",
};

export const typingRoles = [
  "Penetration Tester",
  "Ethical Hacker",
  "Linux Enthusiast",
  "CTF Player",
  "Network Security Learner",
  "Security Researcher",
];

export const education = [
  {
    id: "apu",
    institution: "Asian Pacific University (APU)",
    degree: "Bachelor of Computer Science (Honours) in Cyber Security",
    period: "In Progress",
    coursework: [
      "Network Security",
      "Ethical Hacking",
      "Linux Administration",
      "Secure Programming",
      "Digital Forensics",
      "Computer Networks",
      "Operating Systems",
      "Cryptography",
      "Web Security",
      "Software Engineering",
    ],
  },
];

export const skillCategories = [
  {
    id: "programming",
    label: "Programming",
    skills: ["Python", "Java", "C", "C++"],
  },
  {
    id: "os",
    label: "Operating Systems",
    skills: ["Linux", "Windows"],
  },
  {
    id: "networking",
    label: "Networking",
    skills: [
      "Routing & Switching",
      "TCP/IP",
      "DNS",
      "DHCP",
      "VLAN",
      "Network Troubleshooting",
    ],
  },
  {
    id: "cybersecurity",
    label: "Cybersecurity",
    skills: [
      "Penetration Testing",
      "Vulnerability Assessment",
      "Ethical Hacking",
      "Web Security",
      "Linux Security",
      "Digital Forensics",
      "Network Security",
      "Security Awareness",
      "Incident Analysis",
    ],
  },
];

export const tools = [
  "Kali Linux",
  "Burp Suite",
  "Wireshark",
  "Nmap",
  "Metasploit",
  "Nessus",
  "SQLMap",
  "Hydra",
  "Gobuster",
  "Nikto",
  "Git",
  "VS Code",
  "VirtualBox",
  "VMware",
];

export const certifications = [
  {
    id: "cisco-ethical-hacker",
    issuer: "Cisco Networking Academy",
    name: "Ethical Hacker",
    image: null,
  },
  {
    id: "cisco-intro-networks",
    issuer: "Cisco Networking Academy",
    name: "Introduction to Networks",
    image: null,
  },
  {
    id: "cisco-routing-switching",
    issuer: "Cisco Networking Academy",
    name: "Routing and Switching Essentials",
    image: null,
  },
  {
    id: "fortinet-cybersecurity",
    issuer: "Fortinet",
    name: "Getting Started in Cybersecurity",
    image: null,
  },
];

export const achievements = [
  {
    id: "forbes-ideathon",
    icon: "trophy",
    title: "1st Position – Forbes College Ideathon",
    date: "",
  },
  {
    id: "codefest-2025",
    icon: "laptop",
    title: "Participant – Codefest 2025",
    date: "2025",
  },
  {
    id: "hackathon",
    icon: "rocket",
    title: "Hackathon Participant",
    date: "",
  },
  {
    id: "awareness-program",
    icon: "target",
    title: "Conducted Cybersecurity Awareness Program",
    date: "",
  },
  {
    id: "ncc",
    icon: "medal",
    title: "National Cadet Corps (NCC) Participant",
    date: "",
  },
  {
    id: "hack-astra",
    icon: "flag",
    title: "CTF Participant – Hack Astra",
    date: "",
  },
];

export type ProjectCategory =
  | "Penetration Testing"
  | "Forensics"
  | "Networking"
  | "Machine Learning"
  | "Web Security";

export const projects: {
  id: string;
  title: string;
  description: string;
  categories: ProjectCategory[];
  github: string | null;
  image: string | null;
}[] = [
  {
    id: "resume-ranking",
    title: "Resume Ranking System using Sentence-BERT",
    description:
      "A semantic resume screening tool that ranks candidate resumes against job descriptions using Sentence-BERT embeddings and cosine similarity.",
    categories: ["Machine Learning"],
    github: null,
    image: null,
  },
  {
    id: "malware-analysis-lab",
    title: "Malware Analysis Lab",
    description:
      "An isolated lab environment for static and dynamic analysis of malware samples, using sandboxing and behavioral monitoring techniques.",
    categories: ["Forensics"],
    github: null,
    image: null,
  },
  {
    id: "linux-admin-lab",
    title: "Linux Administration Lab",
    description:
      "Hands-on lab covering Linux system hardening, user/permission management, service configuration, and shell scripting for automation.",
    categories: ["Networking"],
    github: null,
    image: null,
  },
  {
    id: "network-vuln-scanner",
    title: "Network Vulnerability Scanner",
    description:
      "A custom Python-based scanner that identifies open ports, service versions, and known vulnerabilities across a target network.",
    categories: ["Penetration Testing", "Networking"],
    github: null,
    image: null,
  },
  {
    id: "web-security-toolkit",
    title: "Web Security Assessment Toolkit",
    description:
      "A collection of scripts and workflows for assessing common web vulnerabilities such as SQLi, XSS, and misconfigurations using Burp Suite and SQLMap.",
    categories: ["Web Security", "Penetration Testing"],
    github: null,
    image: null,
  },
  {
    id: "memory-disk-forensics",
    title: "Memory and Disk Forensics",
    description:
      "A digital forensics case study performing memory dump and disk image analysis to reconstruct attacker activity and recover artifacts.",
    categories: ["Forensics"],
    github: null,
    image: null,
  },
];

export const projectCategories: ProjectCategory[] = [
  "Penetration Testing",
  "Web Security",
  "Networking",
  "Forensics",
  "Machine Learning",
];
