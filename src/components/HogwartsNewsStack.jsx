import ScrollStack, { ScrollStackItem } from './ScrollStack';
import './HogwartsNewsStack.css';

const news = [
  {
    href: '/post/advice-on-international-university-pathways',
    category: 'Vida acadêmica',
    date: '17 de julho de 2026',
    title: 'Depois de Hogwarts: caminhos para o mundo bruxo',
    summary:
      'Da cura mágica à pesquisa de criaturas, cada estudante recebe orientação para transformar aptidões e paixões em uma carreira com propósito.',
  },
  {
    href: '/post/annas-global-learning-journey',
    category: 'Vida acadêmica',
    date: '6 de julho de 2026',
    title: 'Aritmancia além das fronteiras',
    summary:
      'Uma aluna levou o conhecimento de sua Casa a um encontro internacional de jovens pesquisadores e voltou com novas perguntas — o melhor resultado possível.',
  },
  {
    href: '/post/stem-in-korowas-junior-school',
    category: 'Vida acadêmica',
    date: '3 de julho de 2026',
    title: 'Quando a curiosidade vira encantamento',
    summary:
      'Perguntar, testar, observar e tentar de novo: é assim que nossos estudantes transformam curiosidade em domínio verdadeiro da magia.',
  },
  {
    href: '/post/cross-school-maths-learning',
    category: 'Vida acadêmica',
    date: '1 de julho de 2026',
    title: 'Aritmancia na prática: lógica, estratégia e um pouco de magia',
    summary:
      'Turmas de diferentes anos uniram raciocínio e criatividade para decifrar desafios que nem os retratos conseguiram resolver.',
  },
  {
    href: '/post/school-captains-reunion',
    category: 'Ex-alunos',
    date: '15 de junho de 2026',
    title: 'Antigos alunos, novas histórias',
    summary:
      'Ex-alunos voltaram ao castelo para compartilhar memórias, reencontrar suas Casas e inspirar quem ainda está escrevendo a própria história.',
  },
  {
    href: '/post/preparing-for-stem-racing-state-final',
    category: 'Notícias do castelo',
    date: '10 de junho de 2026',
    title: 'Vassouras prontas para o campeonato entre Casas',
    summary:
      'Meses de treino, estratégia e ajustes nas vassouras culminaram em uma seletiva eletrizante para o campeonato de Quadribol.',
  },
  {
    href: '/post/year-3-letter-writing-project-literacy-skills',
    category: 'Vida acadêmica',
    date: '5 de junho de 2026',
    title: 'Das primeiras penas às cartas por coruja',
    summary:
      'Uma atividade de correspondência transformou a escrita em aventura para os alunos dos primeiros anos.',
  },
  {
    href: '/post/family-affair-at-our-legally-blonde-jr-production',
    category: 'Notícias do castelo',
    date: '3 de junho de 2026',
    title: 'Quando o Salão Principal virou palco',
    summary:
      'Música, cenários encantados e muito talento transformaram o Salão Principal em uma celebração inesquecível.',
  },
];

export default function HogwartsNewsStack({ images = [] }) {
  return (
    <section id="novidades" className="section_latest-news hogwarts-news-section" aria-labelledby="hogwarts-news-title">
      <div className="padding-global padding-section-small">
        <div className="container-large">
          <header className="latest-news_header-wrap">
            <div className="eyebrow_component" data-wf--element-eyebrow--layout="horizontal">
              <div className="eyebrow_icon" aria-hidden="true">
                <span className="icon_svg" data-wf--global-general-icon--icon="flower" />
              </div>
              <p className="text-style-eyebrow">Acontece em Hogwarts</p>
            </div>
            <div className="spacer-1d5" />
            <h2 id="hogwarts-news-title">
              <em>Novidades</em> trazidas pelas corujas
            </h2>
          </header>

          <ScrollStack
            className="hogwarts-news-stack"
            useWindowScroll
            itemDistance={92}
            itemScale={0.025}
            itemStackDistance={28}
            stackPosition="16%"
            scaleEndPosition="8%"
            baseScale={0.82}
            rotationAmount={0}
            blurAmount={0}
          >
            {news.map((item, index) => (
              <ScrollStackItem key={item.title} itemClassName="latest-news_stack-item">
                <a className="news_card_component w-inline-block" href={item.href}>
                  <div className="overflow-clip">
                    <img alt={item.title} className="news_card_image" loading="lazy" src={images[index]} />
                  </div>
                  <div className="news_card_meta-wrap">
                    <p className="news_card_category">{item.category}</p>
                    <p>{item.date}</p>
                  </div>
                  <div className="news_card_content-wrap">
                    <h3 className="news_card_title">{item.title}</h3>
                    <div className="spacer-0d5" />
                    <p className="news_card_summary">{item.summary}</p>
                  </div>
                </a>
              </ScrollStackItem>
            ))}
          </ScrollStack>

          <div className="hogwarts-news-footer">
            <a className="hogwarts-news-all" href="/resources/blog">
              Ler todas as notícias <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
