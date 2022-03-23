import {PanelHeader} from './PanelHeader';
import {PanelRow, TwoColumnPanelRow} from './PanelRow';
import {SegmentedField} from '../ui/SegmentedField/SegmentedField';
import {Show} from 'solid-js';
import {RangeField} from '../ui/RangeField/RangeField';
import {ColorPicker} from '../ui/ColorPicker/ColorPicker';
import {
  frame$,
  setBackground,
  setOpacity,
  setVisibility,
} from '@codeimage/store/frame';
import {fromObservableObject} from '../../core/hooks/from-observable-object';
import {useI18n} from '@codeimage/locale';
import sidebarLocale from '../../i18n/sidebar';
import {setPadding} from '../../state/frame';

export const FrameStyleForm = () => {
  const [t] = useI18n<typeof sidebarLocale>();
  const frame = fromObservableObject(frame$);

  return (
    <>
      <PanelHeader label={t('frame.frame')} />

      <PanelRow for={'paddingField'} label={t('frame.padding')}>
        <TwoColumnPanelRow>
          <SegmentedField
            id={'paddingField'}
            size={'xs'}
            value={frame.padding}
            onChange={setPadding}
            items={[
              {label: '16', value: 16},
              {label: '32', value: 32},
              {label: '64', value: 64},
              {label: '128', value: 128},
            ]}
          />
        </TwoColumnPanelRow>
      </PanelRow>

      <PanelRow for={'visibleField'} label={t('frame.visible')}>
        <TwoColumnPanelRow>
          <SegmentedField
            id={'visibleField'}
            size={'xs'}
            value={frame.visible}
            onChange={setVisibility}
            items={[
              {label: 'Yes', value: true},
              {label: 'No', value: false},
            ]}
          />
        </TwoColumnPanelRow>
      </PanelRow>

      <Show when={frame.visible}>
        <PanelRow for={'opacityField'} label={t('frame.opacity')}>
          <TwoColumnPanelRow>
            <RangeField
              id={'opacityField'}
              value={frame.opacity}
              min={0}
              disabled={!frame.visible}
              max={100}
              onChange={setOpacity}
            />
          </TwoColumnPanelRow>
        </PanelRow>
      </Show>

      <Show when={frame.visible}>
        <PanelRow for={'colorField'} label={t('frame.color')}>
          <TwoColumnPanelRow>
            <ColorPicker
              id={'colorField'}
              onChange={setBackground}
              value={frame.background ?? undefined}
            />
          </TwoColumnPanelRow>
        </PanelRow>
      </Show>
    </>
  );
};
