import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { useColorScheme } from 'react-native';

import { Colors } from '@/constants/theme';

export default function AppTabs() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];

  return (
    <NativeTabs
      backgroundColor={colors.background}
      indicatorColor={colors.backgroundElement}
      labelStyle={{ selected: { color: colors.text } }}
    >
      {/* Home */}
      <NativeTabs.Trigger name="index">
  <NativeTabs.Trigger.Label>
    Home
  </NativeTabs.Trigger.Label>

  <NativeTabs.Trigger.Icon
    src={require('@/assets/images/tabIcons/home.png')}
    renderingMode="template"
  />
</NativeTabs.Trigger>

<NativeTabs.Trigger name="deities">
  <NativeTabs.Trigger.Label>
    Deities
  </NativeTabs.Trigger.Label>

  <NativeTabs.Trigger.Icon
    src={require('@/assets/images/tabIcons/explore.png')}
    renderingMode="template"
  />
</NativeTabs.Trigger>

<NativeTabs.Trigger name="pooja">
  <NativeTabs.Trigger.Label>
    Pooja
  </NativeTabs.Trigger.Label>

  <NativeTabs.Trigger.Icon
    src={require('@/assets/images/tabIcons/explore.png')}
    renderingMode="template"
  />
</NativeTabs.Trigger>

<NativeTabs.Trigger name="activities">
  <NativeTabs.Trigger.Label>
    Activities
  </NativeTabs.Trigger.Label>

  <NativeTabs.Trigger.Icon
    src={require('@/assets/images/tabIcons/explore.png')}
    renderingMode="template"
  />
</NativeTabs.Trigger>

<NativeTabs.Trigger name="menu">
  <NativeTabs.Trigger.Label>
    Menu
  </NativeTabs.Trigger.Label>

  <NativeTabs.Trigger.Icon
    src={require('@/assets/images/tabIcons/explore.png')}
    renderingMode="template"
  />
</NativeTabs.Trigger>
    </NativeTabs>
  );
}