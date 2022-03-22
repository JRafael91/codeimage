import {createEffect, lazy, on, Suspense} from 'solid-js';
import {useI18n} from '@codeimage/locale';
import {useModality} from './core/hooks/isMobile';
import {NotificationHandler} from './components/ui/Toast/SnackbarHost';
import {PortalHost} from './components/ui/PortalHost/PortalHost';
import {initEffects, registerEffects} from '@ngneat/effects';
import {onTabNameChange$, onThemeChange$} from '@codeimage/store/effect';
import {uiStore} from './state/ui';

initEffects();
registerEffects([onTabNameChange$, onThemeChange$]);

const ReloadPrompt = lazy(() => {
  return import('./components/PromptUpdate/PromptUpdate');
});

const Content = lazy(() => {
  const modality = useModality();
  return (modality === 'full' ? import('./Desktop') : import('./Mobile')).then(
    e => {
      document.querySelector('#launcher')?.remove();
      return e;
    },
  );
});

const App = () => {
  const [, {locale}] = useI18n();
  createEffect(on(() => uiStore.locale, locale));

  return (
    <>
      <NotificationHandler />
      <ReloadPrompt />
      <PortalHost />
      <Suspense>
        <Content />
      </Suspense>
    </>
  );
};

export default App;
