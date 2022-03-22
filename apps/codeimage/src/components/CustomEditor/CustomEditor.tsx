import {EditorView} from '@codemirror/view';
import {editor$, setCode, setFocus} from '@codeimage/store/editor';
import {appEnvironment} from '../../core/configuration';
import {createMemo, createResource, Show} from 'solid-js';
import {lineNumbers} from '@codemirror/gutter';
import {createCustomFontExtension} from './custom-font-extension';
import {CodeMirror} from 'solid-codemirror';
import {EDITOR_BASE_SETUP} from '@codeimage/config';
import clsx from 'clsx';
import {observeFocusExtension} from './observe-focus-extension';
import {fromObservableObject} from '../../core/hooks/from-observable-object';
import {focusedEditor$} from '../../state/editor';

export const CustomEditor = () => {
  const {languages, themes, fonts} = appEnvironment;
  const editor = fromObservableObject(editor$);

  const selectedLanguage = createMemo(() =>
    languages.find(language => language.id === editor.languageId),
  );

  const [currentLanguage] = createResource(selectedLanguage, ({plugin}) =>
    plugin(),
  );

  const themeConfiguration = createMemo(() =>
    themes.find(theme => theme.id === editor.themeId),
  );

  const currentTheme = () => themeConfiguration()?.editorTheme || [];

  const supportsLineWrap = EditorView.lineWrapping;

  const baseTheme = EditorView.theme({
    '&': {
      textAlign: 'left',
      background: 'transparent',
    },
    '.cm-content': {
      textAlign: 'left',
    },
    '.cm-gutters': {
      backgroundColor: 'transparent',
      border: 'none',
    },
    '.cm-lineNumbers': {
      position: 'sticky',
      flexDirection: 'column',
      flexShrink: 0,
    },
    '.cm-lineNumbers .cm-gutterElement': {
      textAlign: 'right',
      padding: '0 16px 0 8px',
      lineHeight: '21px',
    },
    '.cm-line': {
      padding: '0 2px 0 8px',
    },
    '.cm-cursor': {
      borderLeftWidth: '2px',
      height: '21px',
      transform: 'translateY(-10%)',
    },
  });

  const customFontExtension = () =>
    createCustomFontExtension({
      fontName:
        fonts.find(({id}) => editor.fontId === id)?.name || fonts[0].name,
      fontWeight: editor.fontWeight,
    });

  const externalStylesheet = createMemo(
    () => themeConfiguration()?.externalStylesheet,
    null,
    {equals: (prev, next) => prev?.scope === next?.scope},
  );

  setTimeout(() => {
    const content = document.querySelector('.cm-content');
    if (!content) {
      return;
    }

    /**
     * **🚀 Seo tip: fix invalid aria roles for CodeMirror**
     */
    content.setAttribute('id', 'codeEditor');
    content.setAttribute('aria-label', 'codeimage-editor');
    content.removeAttribute('aria-expanded');
  });

  return (
    <Show when={themeConfiguration()}>
      <code
        class={clsx(
          externalStylesheet()?.parentClass,
          `language-${selectedLanguage()?.id ?? 'default'}`,
        )}
      >
        <div class={externalStylesheet()?.className}>
          <CodeMirror
            value={editor.code}
            onChange={setCode}
            extensions={[
              EDITOR_BASE_SETUP,
              baseTheme,
              supportsLineWrap,
              observeFocusExtension(
                focused => setFocus(focused),
                vu => {
                  // ATTENTION: a lot of multiple calls to fix!!
                  focusedEditor$.subscribe(focused => {
                    if (focused && !vu.view.hasFocus) {
                      vu.view.focus();
                    }
                  });
                },
              ),
              customFontExtension(),
              currentLanguage() || [],
              currentTheme(),
              editor.showLineNumbers ? lineNumbers() : [],
            ]}
            basicSetup={false}
            editable={true}
          />
        </div>
      </code>
    </Show>
  );
};
