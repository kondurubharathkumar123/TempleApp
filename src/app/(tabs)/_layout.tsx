import { NativeTabs } from 'expo-router/unstable-native-tabs';

const COLORS = {
  background: '#FFFDF8',
  selectedBackground: '#F7EBD7',
  maroon: '#6B1720',
  maroonDark: '#541018',
  gold: '#C69A3A',
  goldSoft: '#D8B766',
  inactive: '#8E8175',
  border: '#E8DCCB',
};

export default function AppTabs() {
  return (
    <NativeTabs
      backgroundColor={COLORS.background}
      indicatorColor={COLORS.gold}
      iconColor={{
        default: COLORS.inactive,
        selected: COLORS.maroon,
      }}
      labelStyle={{
        default: {
          color: COLORS.inactive,
          fontSize: 11,
          fontWeight: '600',
        },
        selected: {
          color: COLORS.maroon,
          fontSize: 11,
          fontWeight: '800',
        },
      }}
      blurEffect="systemMaterialLight"
      disableTransparentOnScrollEdge
      minimizeBehavior="never"
    >
      {/* --------------------------------------------------------------- */}
      {/* HOME                                                            */}
      {/* --------------------------------------------------------------- */}

      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>
          Home
        </NativeTabs.Trigger.Label>

        <NativeTabs.Trigger.Icon
          sf={{
            default: 'house',
            selected: 'house.fill',
          }}
          md={{
            default: 'home',
            selected: 'home',
          }}
        />
      </NativeTabs.Trigger>

      {/* --------------------------------------------------------------- */}
      {/* DEITIES                                                         */}
      {/* --------------------------------------------------------------- */}

      <NativeTabs.Trigger name="deities">
        <NativeTabs.Trigger.Label>
          Deities
        </NativeTabs.Trigger.Label>

        <NativeTabs.Trigger.Icon
          sf={{
            default: 'building.columns',
            selected: 'building.columns.fill',
          }}
          md={{
            default: 'temple_hindu',
            selected: 'temple_hindu',
          }}
        />
      </NativeTabs.Trigger>

      {/* --------------------------------------------------------------- */}
      {/* POOJA                                                           */}
      {/* --------------------------------------------------------------- */}

      <NativeTabs.Trigger name="pooja">
        <NativeTabs.Trigger.Label>
          Pooja
        </NativeTabs.Trigger.Label>

        <NativeTabs.Trigger.Icon
          sf={{
            default: 'hands.sparkles',
            selected: 'hands.sparkles.fill',
          }}
          md={{
            default: 'self_improvement',
            selected: 'self_improvement',
          }}
        />
      </NativeTabs.Trigger>

      {/* --------------------------------------------------------------- */}
      {/* ACTIVITIES                                                      */}
      {/* --------------------------------------------------------------- */}

      <NativeTabs.Trigger name="activities">
        <NativeTabs.Trigger.Label>
          Activities
        </NativeTabs.Trigger.Label>

        <NativeTabs.Trigger.Icon
          sf={{
            default: 'calendar',
            selected: 'calendar.circle.fill',
          }}
          md={{
            default: 'event',
            selected: 'event',
          }}
        />
      </NativeTabs.Trigger>

      {/* --------------------------------------------------------------- */}
      {/* MENU                                                            */}
      {/* --------------------------------------------------------------- */}

      <NativeTabs.Trigger name="menu">
        <NativeTabs.Trigger.Label>
          Menu
        </NativeTabs.Trigger.Label>

        <NativeTabs.Trigger.Icon
          sf={{
            default: 'square.grid.2x2',
            selected: 'square.grid.2x2.fill',
          }}
          md={{
            default: 'apps',
            selected: 'apps',
          }}
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}