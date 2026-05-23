import React, { useState } from 'react';

const MILESTONES = [
  { year: '2026', title: 'Senior Creative Frontend Engineer', desc: 'Building iamjames.lol and exploring the limits of WebGL and Framer Motion.' },
  { year: '2023', title: 'Frontend Developer', desc: 'Mastered React, Next.js, and complex state management for enterprise applications.' },
  { year: '2020', title: 'Junior Developer', desc: 'Learned the ropes of HTML, CSS, JS, and classic web design.' },
  { year: '2018', title: 'Hello World', desc: 'Wrote my first line of code and got hooked.' },
];

const SKILLS = [
  { category: 'LANGUAGES', items: ['TypeScript', 'JavaScript', 'HTML5', 'CSS3', 'GLSL'] },
  { category: 'FRAMEWORKS', items: ['React', 'Next.js', 'Vite', 'Three.js'] },
  { category: 'TOOLS', items: ['Git', 'Framer Motion', 'Tailwind', 'Webpack'] },
  { category: 'SYSTEMS', items: ['Linux', 'Node.js', 'Docker', 'Vercel'] },
];

const AboutApp: React.FC = () => {
  const [activeMilestone, setActiveMilestone] = useState<number | null>(null);

  return (
    <div className="flex flex-col h-full font-mono text-sm overflow-y-auto pr-2">
      {/* Header */}
      <div className="border-b-2 border-white mb-4 pb-2">
        <h1 className="text-xl font-bold">USER_PROFILE: JAMES</h1>
        <p className="opacity-80">BRENTLINGER</p>
        <p className="opacity-80">SYS_ROLE: Senior Creative Frontend Engineer</p>
        <p className="opacity-80">STATUS: ONLINE // READY FOR INPUT</p>
      </div>

      {/* Portrait + Bio row */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="shrink-0 border-2 border-white p-1 bg-black self-start">
          <img
            src="/portrait.png"
            alt="Portrait"
            className="w-32 h-32 sm:w-40 sm:h-40 object-cover"
            draggable={false}
          />
        </div>
        <div className="flex-1">
          <h2 className="font-bold mb-2 bg-white text-black inline-block px-1">:: BIO_DATA</h2>
          <p className="leading-relaxed">
            Hi, I'm James. I'm a certified optician, software developer, and creator based in Lexington, Kentucky. My work centers on solving real-world problems through a mix of technical precision and practical design—whether that means calculating complex lens physics, developing secure workflow apps for optical labs, or diving into custom software projects. When I'm not coding or working with optics, you can usually find me modifying games, playing music, or collaborating on community projects.
          </p>
        </div>
      </div>

      {/* Skill Grid */}
      <div className="mb-6">
        <h2 className="font-bold mb-2 bg-white text-black inline-block px-1">:: SYSTEMS_REPORT (SKILLS)</h2>
        <div className="grid grid-cols-2 gap-4 border-2 border-gray-600 p-2">
          {SKILLS.map((skillGroup, idx) => (
            <div key={idx}>
              <span className="font-bold text-gray-400">[{skillGroup.category}]</span>
              <ul className="list-none mt-1">
                {skillGroup.items.map(item => (
                  <li key={item} className="before:content-['>'] before:mr-2 before:text-gray-500">{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div>
        <h2 className="font-bold mb-4 bg-white text-black inline-block px-1">:: EXECUTION_LOG (TIMELINE)</h2>
        <div className="relative border-l-2 border-white ml-2 pl-6 space-y-6">
          {MILESTONES.map((milestone, idx) => (
            <div 
              key={idx} 
              className="relative cursor-pointer group"
              onMouseEnter={() => setActiveMilestone(idx)}
              onMouseLeave={() => setActiveMilestone(null)}
            >
              {/* Timeline Point */}
              <div className={`absolute -left-7.75 top-1 w-3 h-3 transition-colors duration-200 ${activeMilestone === idx ? 'bg-white' : 'bg-black border-2 border-white'}`} />
              
              <div className={`transition-opacity duration-200 ${activeMilestone !== null && activeMilestone !== idx ? 'opacity-50' : 'opacity-100'}`}>
                <span className="font-bold text-lg">{milestone.year}</span>
                <span className="mx-2 text-gray-500">//</span>
                <span className="font-bold">{milestone.title}</span>
                <p className="mt-1 text-gray-300">{milestone.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutApp;