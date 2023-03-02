import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Text,
  LayoutChangeEvent,
} from 'react-native';
import {
  PanGestureHandler,
  type PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import {
  months,
  PERIOD_MOTHS,
  PERIOD_QUARTER,
  PERIOD_YEAR,
  quarterStartMonths,
} from './constants';
import PeriodTabs from './parts/PeriodTabs';
import { selectPeriod } from './utils';
import { clamp } from './worklets';

type GestureContext = {
  startX: number;
};

type Props = {
  initialMonths?: number[];
  onChange?: (monthsRange: number[]) => void;
};

const RangeSelector: React.FC<Props> = ({
  initialMonths = [4, 6],
  onChange = () => {},
}) => {
  const periodTabs = [PERIOD_YEAR, PERIOD_QUARTER, PERIOD_MOTHS];
  const [tabWidth, setTabWidth] = useState(0);
  const [activePeriod, setActivePeriod] = useState(
    selectPeriod(initialMonths[0], initialMonths[1]),
  );
  const [range, setRange] = useState<number[]>(initialMonths);
  const tabsWidth = tabWidth * 12;

  const sliderX = useSharedValue(0);
  const sliderWidth = useSharedValue(tabWidth);

  useEffect(() => {
    sliderX.value = range[0] * tabWidth;
    sliderWidth.value = (range[1] - range[0] + 1) * tabWidth;
  }, [range, sliderWidth, sliderX, tabWidth]);

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    setTabWidth(width / 12);
  };

  const overlayStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: withSpring(sliderX.value),
      },
    ],
    width: withSpring(sliderWidth.value),
  }));

  const handleSetRange = useCallback(
    (values: number[]) => {
      setRange(values);
      onChange(values);
    },
    [onChange],
  );

  const setNewPeriod = (): void => {
    const startMonth = Math.round(sliderX.value / tabWidth);
    const endMonth = Math.min(
      Math.round((sliderX.value + sliderWidth.value) / tabWidth) - 1,
      11,
    );
    handleSetRange([startMonth, endMonth]);
    setActivePeriod(selectPeriod(startMonth, endMonth));
  };

  const handleChangePeriod = useCallback(
    (period: string) => {
      setActivePeriod(period);
      if (period === PERIOD_YEAR) {
        handleSetRange([0, 11]);
      } else if (period === PERIOD_QUARTER) {
        let month = 0;
        let delta = quarterStartMonths[quarterStartMonths.length - 1];
        for (let i = 0; i < quarterStartMonths.length; i++) {
          const dx = Math.abs(quarterStartMonths[i] - range[0]);
          if (dx < delta) {
            delta = dx;
            month = quarterStartMonths[i];
          }
        }
        handleSetRange([month, month + 2]);
      }
    },
    [handleSetRange, range],
  );

  const positionGestureEvent = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    GestureContext
  >({
    onStart: (_, ctx) => {
      ctx.startX = sliderX.value;
    },
    onActive: (event, ctx) => {
      const valueX =
        Math.round((ctx.startX + event.translationX) / tabWidth) * tabWidth;
      sliderX.value = clamp(valueX, 0, tabsWidth - sliderWidth.value);
    },
    onEnd: () => runOnJS(setNewPeriod)(),
  });

  const widthGestureEvent = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    GestureContext
  >({
    onStart: (_, ctx) => {
      ctx.startX = sliderWidth.value;
    },
    onActive: (event, ctx) => {
      const valueX =
        Math.round((ctx.startX + event.translationX) / tabWidth) * tabWidth;
      sliderWidth.value = clamp(valueX, tabWidth, tabsWidth);
    },
    onEnd: () => runOnJS(setNewPeriod)(),
  });

  return (
    <View style={styles.container}>
      <PeriodTabs
        tabs={periodTabs}
        active={activePeriod}
        onChange={handleChangePeriod}
      />
      <View style={styles.sliderWrapper}>
        <View style={styles.monthsContainer} onLayout={handleLayout}>
          {months.map(month => (
            <View
              style={[styles.monthTabContainer, { width: tabWidth }]}
              key={month}
              pointerEvents="none"
            >
              <Text style={[styles.monthNameText]}>{month}</Text>
            </View>
          ))}
          <PanGestureHandler onGestureEvent={positionGestureEvent}>
            <Animated.View style={[styles.slider, overlayStyle]}>
              <PanGestureHandler onGestureEvent={widthGestureEvent}>
                <Animated.View style={styles.dotContainer}>
                  {[1, 2, 3].map(key => (
                    <View key={key} style={styles.dot} />
                  ))}
                </Animated.View>
              </PanGestureHandler>
            </Animated.View>
          </PanGestureHandler>
        </View>
      </View>
    </View>
  );
};

interface Styles {
  container: ViewStyle;
  text: TextStyle;
  sliderWrapper: ViewStyle;
  monthsContainer: ViewStyle;
  monthTabContainer: ViewStyle;
  monthNameText: TextStyle;
  slider: ViewStyle;
  dotContainer: ViewStyle;
  dot: ViewStyle;
}

const styles = StyleSheet.create<Styles>({
  container: {
    width: '90%',
    height: 64,
    display: 'flex',
    flexDirection: 'row',
    borderRadius: 32,
    backgroundColor: 'rgba(247, 248, 252, 1)',
    alignItems: 'center',
    overflow: 'hidden',
  },
  text: {
    fontFamily: 'Roboto-Bold',
    fontSize: 16,
    textTransform: 'uppercase',
  },
  sliderWrapper: {
    display: 'flex',
    overflow: 'hidden',
    flex: 1,
    height: 64,
    flexDirection: 'row',
  },
  monthsContainer: {
    marginLeft: 32,
    display: 'flex',
    position: 'relative',
    flex: 1,
    height: 64,
    flexDirection: 'row',
    borderBottomRightRadius: 32,
    borderTopRightRadius: 32,
  },
  monthTabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  monthNameText: {
    fontFamily: 'Roboto-Medium',
    fontSize: 16,
    textTransform: 'lowercase',
    color: 'black',
  },
  slider: {
    position: 'absolute',
    left: 0,
    top: 1,
    bottom: 1,
    backgroundColor: 'white',
    shadowColor: 'rgba(0, 0, 0, 1)',
    borderRadius: 30,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 5,
    display: 'flex',
    alignItems: 'flex-end',
  },
  dotContainer: {
    width: 24,
    display: 'flex',
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 21,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(192, 192, 192, 1)',
  },
});

export default RangeSelector;
