import {Button} from '@codeimage/ui';
import {createDeferred, createSignal} from 'solid-js';
import {useRouteData} from 'solid-start';
import * as styles from '~/components/Main/MainPage.css';
import {breakpoints} from '~/core/breakpoints';
import {routeData as RouteData} from '~/routes/index';
import {GithubButton} from '../GithubButton/GithubButton';
import {Header} from '../Header/Header';

function getRepoInfo() {
  return fetch('https://ungh.unjs.io/repos/riccardoperra/codeimage')
    .then(res => res.json())
    .then(res => res.repo);
}

export default function MainPage() {
  let imageBox: HTMLDivElement;
  const routeData = useRouteData<typeof RouteData>();
  const [loading, setLoading] = createSignal(true);
  const [repo, setRepo] = createSignal<any>(routeData.repoInfo || {stars: 0});

  createDeferred(() =>
    getRepoInfo()
      .then(response => setRepo(response))
      .finally(() => setLoading(false)),
  );

  return (
    <>
      <Header />
      <section class={styles.main}>
        <div class={styles.content}>
          <div class={styles.textBox}>
            <div class={styles.heroContainer}>
              <h1 class={styles.heading}>
                A tool for <br />{' '}
                <span class={styles.screenshot}>beautify</span> your{' '}
                <span class={styles.screenshot}>code</span> screenshots
              </h1>

              <p class={styles.mobileDescription}>
                Instantly manage your code snippets, make them beautiful to read
                and share them to everyone.
              </p>
            </div>

            <div class={styles.ctaContainer}>
              <Button size={'lg'} variant={'solid'} theme={'primary'}>
                Getting started
              </Button>

              <GithubButton
                size={'lg'}
                variant={'solid'}
                theme={'secondary'}
                loading={loading()}
                stars={repo().stars}
              />
            </div>
          </div>
          <div class={styles.imagePerspectiveBox} ref={imageBox}>
            <div class={styles.imageSection}>
              <div class={styles.imageBox}>
                <picture>
                  <source
                    type="image/webp"
                    srcset={'/landing/codeimage_preview_mobile_ultra.webp'}
                    media={`(max-width: ${breakpoints.tablet}px)`}
                  />
                  <source
                    type="image/webp"
                    srcset={'/landing/codeimage_preview_mobile.webp'}
                    media={`(min-width: ${breakpoints.tablet}px)`}
                  />
                  <source
                    type="image/webp"
                    srcset={'/landing/codeimage_preview_desktop.webp'}
                    media={`(min-width: ${breakpoints.desktop}px)`}
                  />
                  <img
                    class={styles.imageLeft}
                    loading={'lazy'}
                    src={'/landing/codeimage_preview_lite.png'}
                    alt={'Preview of CodeImage snippet'}
                  />
                </picture>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export function MainPageImagePreloading() {
  return (
    <>
      <link
        rel="preload"
        href={'/landing/codeimage_preview_mobile.webp'}
        as="image"
        media={`(min-width: ${breakpoints.tablet}px)`}
      />
      <link
        rel="preload"
        href={'/landing/codeimage_preview_desktop.webp'}
        as="image"
        media={`(min-width: ${breakpoints.desktop}px)`}
      />
    </>
  );
}