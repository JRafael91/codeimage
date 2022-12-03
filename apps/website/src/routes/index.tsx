import {createResource} from 'solid-js';
import MainPage from '~/components/Main/MainPage';
import {hydrateOnViewport} from '~/core/hydrateOnViewport';

function getRepoInfo() {
  return fetch('https://ungh.unjs.io/repos/riccardoperra/codeimage')
    .then(res => res.json())
    .then(res => res.repo);
}

export function routeData() {
  const [data] = createResource(getRepoInfo);
  return {
    repoInfo: data(),
  };
}

const EditorSteps = hydrateOnViewport(
  () => import('../components/Landing/EditorSteps/EditorSteps'),
  'idle',
);

const Projects = hydrateOnViewport(
  () => import('../components/Landing/Projects/Projects'),
  'visible',
  {
    rootMargin: '500px',
  },
);

const ComingSoon = hydrateOnViewport(
  () => import('../components/Landing/ComingSoon/ComingSoon'),
  'visible',
  {
    rootMargin: '500px',
  },
);

const OpenSource = hydrateOnViewport(
  () => import('../components/Landing/OpenSource/OpenSource'),
  'visible',
  {
    rootMargin: '500px',
  },
);

const Showcase = hydrateOnViewport(
  () => import('../components/Landing/Showcase/Showcase'),
  'visible',
  {
    rootMargin: '500px',
  },
);

const Footer = hydrateOnViewport(
  () => import('../components/Footer/Footer'),
  'visible',
);

export default function Home() {
  return (
    <main>
      <MainPage />
      <EditorSteps />
      <Projects />
      <ComingSoon />
      <OpenSource />
      <Showcase />
      <Footer />
    </main>
  );
}