import React from 'react';
import {
  StyleSheet,
  View,
  ViewStyle,
  Text,
  TextStyle,
  TouchableWithoutFeedback,
} from 'react-native';

type Props = {
  onChange: (tab: string) => void;
  tabs: string[];
  active: string;
};

const PeriodTabs: React.FC<Props> = ({ onChange, tabs, active }) => (
  <View style={styles.container}>
    {tabs.map((tab, key) => (
      <TouchableWithoutFeedback key={key} onPress={() => onChange(tab)}>
        <View style={[styles.tab, active === tab && styles.tabActive]}>
          <Text
            style={[styles.tabText, active === tab && styles.tabTextActive]}
          >
            {tab}
          </Text>
        </View>
      </TouchableWithoutFeedback>
    ))}
  </View>
);

interface Styles {
  container: ViewStyle;
  tab: ViewStyle;
  tabActive: ViewStyle;
  tabText: TextStyle;
  tabTextActive: TextStyle;
}

const styles = StyleSheet.create<Styles>({
  container: {
    flexDirection: 'row',
    height: 48,
    justifyContent: 'space-between',
  },
  tab: {
    textAlign: 'center',
    height: 48,
    borderRadius: 24,
    display: 'flex',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  tabActive: {
    backgroundColor: 'rgba(66, 77, 88, 1)',
  },
  tabText: {
    fontFamily: 'Roboto-Bold',
    fontSize: 14,
    textTransform: 'uppercase',
    color: 'rgba(0, 0, 0, 1)',
  },
  tabTextActive: {
    color: 'rgba(255, 255, 255, 1)',
  },
});

export default PeriodTabs;
