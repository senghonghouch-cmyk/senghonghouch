//@version=6
indicator("PROHONG", overlay=true,
     max_boxes_count=500,
     max_labels_count=500)

// =====================================================
// SETTINGS
// =====================================================

extendBoxes = input.int(20, "Box Extension", minval=5)
showFVG = input.bool(true, "Show FVG")
showOB = input.bool(true, "Show Order Block")
showSweep = input.bool(true, "Show Liquidity Sweep")

// =====================================================
// FAIR VALUE GAP (FVG)
// =====================================================

// Bullish FVG
bullFVG = low > high[2]

// Bearish FVG
bearFVG = high < low[2]

// Draw Bullish FVG
if showFVG and bullFVG
    box.new(
         left=bar_index-2,
         top=low,
         right=bar_index + extendBoxes,
         bottom=high[2],
         bgcolor=color.new(color.lime, 85),
         border_color=color.lime,
         border_width=2)

// Draw Bearish FVG
if showFVG and bearFVG
    box.new(
         left=bar_index-2,
         top=low[2],
         right=bar_index + extendBoxes,
         bottom=high,
         bgcolor=color.new(color.red, 85),
         border_color=color.red,
         border_width=2)

// =====================================================
// ORDER BLOCK
// =====================================================

// Bullish OB
bullOB = (close[1] < open[1] and close > high[1])

// Bearish OB
bearOB = (close[1] > open[1] and close < low[1])

// Bullish OB Box
if showOB and bullOB
    box.new(
         left=bar_index-1,
         top=open[1],
         right=bar_index + extendBoxes,
         bottom=low[1],
         bgcolor=color.new(color.aqua, 85),
         border_color=color.aqua,
         border_width=2)

// Bearish OB Box
if showOB and bearOB
    box.new(
         left=bar_index-1,
         top=high[1],
         right=bar_index + extendBoxes,
         bottom=open[1],
         bgcolor=color.new(color.orange, 85),
         border_color=color.orange,
         border_width=2)

// =====================================================
// LIQUIDITY SWEEP
// =====================================================

swingHigh = ta.highest(high, 10)[1]
swingLow = ta.lowest(low, 10)[1]

// Buy-side Sweep
buySweep = (high > swingHigh and close < swingHigh)

// Sell-side Sweep
sellSweep = (low < swingLow and close > swingLow)

// Sweep Labels
plotshape(
     showSweep and buySweep,
     style=shape.triangledown,
     location=location.abovebar,
     color=color.red,
     size=size.small,
     text="Buy")

plotshape(
     showSweep and sellSweep,
     style=shape.triangleup,
     location=location.belowbar,
     color=color.lime,
     size=size.small,
     text="Sell")

// =====================================================
// BUY / SELL SIGNAL
// =====================================================

buySignal = sellSweep and bullOB
sellSignal = buySweep and bearOB

plotshape(
     buySignal,
     style=shape.labelup,
     location=location.belowbar,
     color=color.green,
     text="BUY")

plotshape(
     sellSignal,
     style=shape.labeldown,
     location=location.abovebar,
     color=color.red,
     text="SELL")