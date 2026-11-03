export const bio = [
  'I work where hardware security meets distributed systems. My doctoral research builds a trust architecture that starts in silicon and ends in consensus: physical unclonable functions (PUFs) give each device an identity that cannot be copied, post-quantum cryptography keeps that identity safe against future attackers, and blockchain consensus lets thousands of devices agree on what is true.',
  'Alongside the thesis I work on quantum-aware security and quantum-driven sensing for connected vehicles. I like building the testbeds as much as the theory, from a 16-node ARM/x86 edge cluster to vehicle-ECU hardware-in-the-loop rigs.',
  'I am currently a Visiting Researcher at the qCLOUDS Lab, School of Computing and Information Systems, The University of Melbourne, where I work on fault-tolerant distributed quantum computing: keeping computations correct when they are split across many networked quantum processors.',
];

export const education = [
  {
    period: '2022 – present',
    degree: 'Ph.D., Centre for AIoT and Applications',
    school: 'Indian Institute of Technology Jodhpur',
    thesis: 'Towards a Hardware-Anchored Blockchain-Enabled Trust Architecture for Secure and Resilient IoT and Cyber-Physical Systems',
  },
  {
    period: '2019 – 2021',
    degree: 'M.Tech, Information Technology (IoT specialization)',
    school: 'Maulana Abul Kalam Azad University of Technology (formerly WBUT)',
    note: 'First position in the programme',
    thesis: 'Security Enhancement for Internet of Things Using Blockchain',
  },
  {
    period: '2015 – 2019',
    degree: 'B.Tech, Electronics and Communication Engineering',
    school: 'Maulana Abul Kalam Azad University of Technology (formerly WBUT)',
    thesis: 'Smart Grid Technology with Smart Devices and Smart Applications for Smart Cities',
  },
];

export const experience = [
  {
    period: 'Sep 2026 – present',
    role: 'Visiting Researcher',
    links: [
      { label: 'qCLOUDS Lab', url: 'http://www.cloudbus.org/' },
      { label: 'CIS', url: 'https://cis.unimelb.edu.au/' },
      { label: 'FEIT', url: 'https://eng.unimelb.edu.au/' },
      { label: 'University of Melbourne', url: 'https://www.unimelb.edu.au/' },
    ],
    org: 'qCLOUDS Lab, School of Computing and Information Systems, Faculty of Engineering and IT, The University of Melbourne',
    points: [
      'Research on fault-tolerant distributed quantum computing.',
    ],
  },
  {
    period: 'Dec 2024 – Aug 2026',
    role: 'Senior Research Fellow',
    org: 'VANET Lab, Dept. of CSE, IIT Jodhpur',
    points: [
      'Worked on the joint DST–NSF project Towards Secure and Resilient Collaborative Autonomous Driving (CoAD): collaborative sensing and path planning.',
      'Designed a friction-aware kinematic model for mobile robots and LoRa-based localization for GPS-denied environments.',
      'Mentored 2 M.Tech students, 6 B.Tech students and 11 interns across hardware security, blockchain and robotics.',
    ],
  },
  {
    period: 'Jan 2022 – Dec 2024',
    role: 'Junior Research Fellow',
    org: 'VANET Lab, Dept. of CSE, IIT Jodhpur',
    points: [
      'Researched the MOST Taiwan–GITA India project on lightweight anonymous authentication for the Internet of Vehicles.',
      'Designed a PUF-based, hardware-assisted authentication protocol and led integration of a decentralized blockchain ledger.',
      'Built and ran distributed testbeds on NVIDIA Jetson Xavier NX, Raspberry Pi and UP Squared Edge boards.',
    ],
  },
  {
    period: 'Oct 2021 – Jan 2022',
    role: 'Project Associate II',
    org: 'Dream Lab, Dept. of Computational Data Sciences, IISc Bangalore',
    points: [
      'Built MLOps pipelines in a two-person team for the IBM–IISc Hybrid Cloud initiative.',
      'Deployed and orchestrated ML systems with Kubernetes, Apache Airflow and Kubeflow.',
    ],
  },
];

export const skills: { group: string; art: 'code' | 'shield' | 'chip' | 'cluster' | 'chain' | 'qubit'; tone: 'primary' | 'mint' | 'butter' | 'rose'; items: string[] }[] = [
  { group: 'Programming', art: 'code', tone: 'primary', items: ['Python', 'Verilog', 'Embedded C', 'MATLAB', 'Solidity'] },
  { group: 'Hardware security', art: 'shield', tone: 'mint', items: ['pypuf (Arbiter, XOR-APUF, RO, SRAM PUF)', 'SRAM PUF fingerprinting on ESP32-S3', 'Intel MAX 10 FPGA', 'Quartus Prime'] },
  { group: 'Embedded boards', art: 'chip', tone: 'butter', items: ['NVIDIA Jetson (Nano, AGX, Xavier NX)', 'Raspberry Pi (Pico, 3B, 4, 5)', 'STM32', 'ESP32 / ESP8266', 'Arduino', 'Google Coral', 'UP Squared Edge', 'Tang Nano 20K'] },
  { group: 'DevOps & infrastructure', art: 'cluster', tone: 'rose', items: ['Kubernetes', 'Docker', 'Proxmox VE', 'Apache Airflow', 'Kubeflow', 'ArgoCD', 'Prometheus', 'Grafana', 'XCP-ng'] },
  { group: 'Blockchain & IoT', art: 'chain', tone: 'mint', items: ['Ethereum', 'Truffle', 'Ganache', 'MQTT / Mosquitto', 'Node-RED'] },
  { group: 'Quantum & cloud', art: 'qubit', tone: 'primary', items: ['Qiskit', 'IBM Quantum', 'AWS', 'Linux'] },
];

export const domains = ['IoT', 'Physically Unclonable Functions', 'Blockchain', 'Secure Edge AI', 'Edge / Fog Computing', 'Post-Quantum Cryptography', 'Robotics', 'Quantum Computing'];

export const awards = [
  { year: '2026', text: 'IEEE Industrial Electronics Society (IES) Student and Young Professional Congress Travel Grant' },
  { year: '2025', text: 'Invited hands-on tutorial instructor, ACM Summer School on IoT and Next Generation Networks, KARE Madurai' },
  { year: '2024', text: 'Invited research visit, Cryptology and Network Security Lab, National Sun Yat-sen University, Taiwan' },
  { year: '2024', text: '2nd Prize, Industry Day Project Showcase, IIT Jodhpur' },
  { year: '2021', text: '1st Position, M.Tech IT (IoT specialization), MAKAUT' },
  { year: '2020', text: 'Invited talk, “Gateway of Blockchain-IoT Meets the Edge Computing Paradigm”, iTIPS 2020' },
  { year: '', text: 'Selected participant, Karyashala “IoT in Edge-Cloud Continuum”, IIT Indore' },
  { year: '', text: '1st Prize, Robotics and Internet of Things Workshop, IIT Kharagpur' },
];

export const service = {
  journals: [
    'Scientific Reports (Nature Portfolio)', 'Internet of Things (Elsevier)', 'Journal of Network and Systems Management',
    'Cluster Computing', 'The Journal of Supercomputing', 'Wireless Personal Communications',
    'Journal of King Saud University – CIS', 'Discover Internet of Things', 'Discover Artificial Intelligence', 'Journal of Big Data',
  ],
  tpcMember: ['IEEE WCNC 2024, 2025 and 2026'],
  tpcReviewer: ['BTS-I2C 2025 and 2026', 'IEEE ICECIE 2025'],
  membership: ['Graduate Student Member, IEEE'],
};


export const projects = [
  {
    title: 'Fault-tolerant distributed quantum computing',
    kind: 'Visiting research · qCLOUDS Lab, University of Melbourne',
    period: 'Sep 2026 – present',
    theme: 'quantum',
    points: [
      'Fault tolerance for quantum computations distributed across networked quantum processors.',
    ],
  },
  {
    title: 'Secure and Resilient Collaborative Autonomous Driving (CoAD)',
    kind: 'Funded project · Joint DST–NSF',
    period: 'Dec 2024 – Aug 2026',
    theme: 'vehicles',
    points: [
      'Collaborative sensing and path planning for secure, resilient autonomous driving.',
      'Friction-aware kinematic model for mobile robots on varying surfaces.',
      'LoRa-based localization for positioning in GPS-denied environments.',
    ],
  },
  {
    title: 'Lightweight Anonymous Authentication for the Internet of Vehicles',
    kind: 'Funded project · MOST Taiwan–GITA India',
    period: 'Jan 2022 – Dec 2024',
    theme: 'puf',
    points: [
      'Lightweight PUF-based, hardware-assisted authentication for anonymous IoV communication.',
      'Decentralized blockchain architecture for secure data ledgering.',
      'Real-time evaluation on Jetson Xavier NX, Raspberry Pi and UP Squared testbeds.',
    ],
  },
  {
    title: 'Heterogeneous edge cluster for blockchain, security and ECU testing',
    kind: 'Research infrastructure',
    period: 'Oct – Dec 2024',
    theme: 'infra',
    points: [
      '16 nodes: 8 Raspberry Pi 5, 4 Jetson Xavier NX 16 GB, 4 UP Squared Edge AI. 72 cores, about 160 GB memory, up to 84 TOPS.',
      'Kubernetes and Docker across ARM64 and x86; Ethereum, Solidity, MQTT and Node-RED for consensus and telemetry.',
      'Vehicle-ECU and hardware-in-the-loop rigs over CAN, GPIO, UART, SPI and I²C; Verilog on Intel MAX 10.',
    ],
  },
  {
    title: 'VANET Lab private cloud and Kubernetes cluster',
    kind: 'Research infrastructure',
    period: 'Dec 2022 – Feb 2023',
    theme: 'infra',
    points: [
      'Four-node Proxmox VE and Kubernetes cluster for reproducible research workloads.',
      'GPU node with dual Xeon Silver 4216, 252 GiB RAM and an RTX A5000.',
      '124 logical CPUs and about 345 GiB RAM in total.',
    ],
  },
  {
    title: 'Blockchain-based data storage system for the Border Security Force',
    kind: 'Pilot project · BSF, India',
    period: 'Apr – Aug 2021',
    theme: 'chain',
    points: [
      'Engineered a blockchain query mechanism for efficient, secure data retrieval.',
      'End-to-end integrity and auditability through custom smart contracts.',
    ],
  },
  {
    title: 'Security enhancement for IoT using blockchain',
    kind: 'M.Tech research',
    period: 'Aug 2020 – Jun 2021',
    theme: 'chain',
    points: [
      'Zone-based identification so IoT devices establish mutual trust dynamically.',
      'Ethereum smart contracts in Solidity for exchange among authenticated devices.',
    ],
  },
  {
    title: 'Smart grid survey using drones and PTZ cameras',
    kind: 'Pilot project · Techno India',
    period: 'Jul 2018 – Apr 2019',
    theme: 'vehicles',
    points: [
      'SHIFT algorithm for GPS-less navigation and adaptive path planning.',
      'PTZ cameras and IoT telemetry for remote grid monitoring.',
    ],
  },
];
