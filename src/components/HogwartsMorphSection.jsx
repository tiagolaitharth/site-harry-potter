import { useMemo, useState } from 'react';
import MorphSlider from './MorphSlider';
import './HogwartsMorphSection.css';

const content = [
  {
    eyebrow: 'Toda grande jornada precisa de um lugar seguro',
    title: 'Bem-estar',
    suffix: '',
    description:
      'Em Hogwarts, ninguém atravessa os corredores sozinho. Diretores de Casa, professores, monitores e a equipe da enfermaria formam uma rede de apoio para que cada estudante se sinta visto, ouvido e protegido.',
    link: '/about/student-wellbeing',
    button: 'Conheça nossa rede de apoio',
  },
  {
    eyebrow: 'A magia começa nos livros — mas não termina neles',
    title: 'Curiosidade',
    suffix: ' sem limites',
    description:
      'Feitiços, Poções, Transfiguração, Herbologia, Astronomia e Defesa Contra as Artes das Trevas combinam teoria e prática. Aqui, errar faz parte da descoberta — desde que o caldeirão esteja sob supervisão.',
    link: '/learn/enrichment-extension',
    button: 'Explore o currículo de Hogwarts',
  },
];

export default function HogwartsMorphSection({ images = [] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const items = useMemo(
    () => content.map((item, index) => ({ image: images[index], caption: item.title })),
    [images],
  );
  const active = content[activeIndex] ?? content[0];

  return (
    <section id="acolhimento" className="hogwarts-morph-section" aria-labelledby="hogwarts-morph-title">
      <div className="hogwarts-morph-glow" aria-hidden="true" />
      <div className="hogwarts-morph-container">
        <div className="hogwarts-morph-layout">
          <div key={activeIndex} className="hogwarts-morph-copy">
            <p className="hogwarts-morph-eyebrow">{active.eyebrow}</p>
            <h2 id="hogwarts-morph-title" className="hogwarts-morph-title">
              <em>{active.title}</em>{active.suffix}
            </h2>
            <p className="hogwarts-morph-description">{active.description}</p>
            <a className="hogwarts-morph-link" href={active.link}>
              {active.button}
              <span aria-hidden="true">→</span>
            </a>
          </div>

          <div className="hogwarts-morph-media">
            <MorphSlider
              items={items}
              transition="melt"
              duration={1.15}
              intensity={0.55}
              scale={2.4}
              aberration={0.28}
              drift={0.32}
              autoplay
              autoplayDelay={5.5}
              radius={28}
              overlayColor="#1c0828"
              onIndexChange={setActiveIndex}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
