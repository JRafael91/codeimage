import {render} from 'solid-js/web';
import {createI18nContext, I18nContext} from '@codeimage/locale';
import {locale} from './i18n';
import './assets/styles/app.scss';
import {devTools} from '@ngneat/elf-devtools';
import _App from './App';
import {lazy, Suspense} from 'solid-js';

if (import.meta.env.DEV) {
  devTools();
}

const App = lazy(async () => {
  await new Promise(resolve => setTimeout(resolve, 0, null));
  return import('./App');
});

const i18n = createI18nContext(locale);

export function Bootstrap() {
  return (
    <I18nContext.Provider value={i18n}>
      <Suspense>
        <App />
      </Suspense>
    </I18nContext.Provider>
  );
}

render(Bootstrap, document.getElementById('root') as HTMLElement);
