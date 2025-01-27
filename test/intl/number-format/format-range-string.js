// Copyright 2022 the V8 project authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// Flags: --harmony-intl-number-format-v3

// Test the throw in formatRange

let df = new Intl.NumberFormat();

// https://tc39.es/proposal-intl-numberformat-v3/out/numberformat/diff.html#sec-partitionnumberrangepattern
// 2. If x is not-a-number or y is not-a-number, throw a RangeError exception.
assertThrows(() => { df.formatRange("xyz", "123") }, RangeError);
assertThrows(() => { df.formatRange("123", "xyz") }, RangeError);
assertThrows(() => { df.formatRange("1", "-0b1111") }, RangeError);
assertThrows(() => { df.formatRange("1", "-0o7654") }, RangeError);
assertThrows(() => { df.formatRange("1", "-0xabcde") }, RangeError);

// 2. If x is a mathematical value, then
// 2a. If y is a mathematical value and y < x, throw a RangeError exception.
assertThrows(() => { df.formatRange(
   "  +1234567890123456789012345678901234567890123456789012345678901   ",
   "  +123456789012345678901234567890123456789012345678901234567890    ") }, RangeError);
assertThrows(() => { df.formatRange(
   "  +123456789012345678901234567890.123456789012345678901234567890e25   ",
   "  +12345678901234567890.1234567890123456789012345678901234567890e25    ") }, RangeError);
assertThrows(() => { df.formatRange(
   "  +12345678901234567890.1234567890123456789012345678901234567890e35   ",
   "  +123456789012345678901234567890.123456789012345678901234567890e24    ") }, RangeError);
assertThrows(() => { df.formatRange(
   "  -123456789012345678901234567890123456789012345678901234567890    ",
   "  -1234567890123456789012345678901234567890123456789012345678901   ") }, RangeError);
assertThrows(() => { df.formatRange(
   "  -12345678901234567890.1234567890123456789012345678901234567890e25   ",
   "  -123456789012345678901234567890.123456789012345678901234567890e25    ") }, RangeError);
assertThrows(() => { df.formatRange(
   "  -123456789012345678901234567890.123456789012345678901234567890e24    ",
   "  -12345678901234567890.1234567890123456789012345678901234567890e35   ") }, RangeError);
assertThrows(() => { df.formatRange(
   "  +.1234567890123456789012345678901234567890123456789012345678901   ",
   "  +.123456789012345678901234567890123456789012345678901234567890    ") }, RangeError);
assertThrows(() => { df.formatRange(
   "  +.123456789012345678901234567890123456789012345678901234567890   ",
   "  -.1234567890123456789012345678901234567890123456789012345678901    ") }, RangeError);
assertThrows(() => { df.formatRange(
   "  +.12e3   ", "  +.12e2    ") }, RangeError);
assertThrows(() => { df.formatRange(
   "  +123   ", "  +.12e2    ") }, RangeError);
assertThrows(() => { df.formatRange(
   "  -123   ", "  -.12e4    ") }, RangeError);

// 2b. Else if y is negative-infinity, throw a RangeError exception.
assertThrows(() => { df.formatRange( "  123   ", "  -Infinity    ") }, RangeError);
// 2c. Else if y is negative-zero and x ≥ 0, throw a RangeError exception.
assertThrows(() => { df.formatRange( "  123   ", "  -0    ") }, RangeError);

// other case which won't throw under 2
assertDoesNotThrow(() => { df.formatRange( "  123   ", "  Infinity    ") })
assertEquals("123–∞", df.formatRange( "  123   ", "  Infinity    "));
assertDoesNotThrow(() => { df.formatRange(
    "   +.123456789012345678901234567890123456789012345678901234567890   ", "  Infinity    ") })
assertEquals("0.123–∞", df.formatRange(
    "   +.123456789012345678901234567890123456789012345678901234567890   ",
    "  Infinity    "));
assertDoesNotThrow(() => { df.formatRange(
    "   +.123456789012345678901234567890123456789012345678901234567890   ",
    "   +.123456789012345678901234567890123456789012345678901234567890  ")})
assertDoesNotThrow(() => { df.formatRange(
    "   +.123456789012345678901234567890123456789012345678901234567890   ",
    "   +.1234567890123456789012345678901234567890123456789012345678901  ")})
assertDoesNotThrow(() => { df.formatRange(
    "   +12345678901234567890.123456789012345678901234567890123456789000000001e20   ",
    "   +1234567890.12345678901234567890123456789012345678901234567890e31  ")})
// 3. Else if x is positive-infinity, then
// 3a. If y is a mathematical value, throw a RangeError exception.
assertThrows(() => { df.formatRange( "  Infinity   ", "  123    ") }, RangeError);
assertThrows(() => { df.formatRange( "  +Infinity   ", "  123    ") }, RangeError);
// 3b. Else if y is negative-infinity, throw a RangeError exception.
assertThrows(() => { df.formatRange( "  Infinity   ", "  -Infinity    ") }, RangeError);
assertThrows(() => { df.formatRange( "  +Infinity   ", "  -Infinity    ") }, RangeError);
// 3c. Else if y is negative-zero, throw a RangeError exception.
assertThrows(() => { df.formatRange( "  Infinity   ", "  -0    ") }, RangeError);
assertThrows(() => { df.formatRange( "  +Infinity   ", "  -0    ") }, RangeError);

// other case which won't throw under 3
assertDoesNotThrow(() => { df.formatRange( "  Infinity   ", "  Infinity    ") })
assertEquals("~∞", df.formatRange("     Infinity ", "  Infinity    "));

// 4. Else if x is negative-zero, then
// 4a. If y is a mathematical value and y < 0, throw a RangeError exception.
assertThrows(() => { df.formatRange( "  -0   ", "  -1e-30    ") }, RangeError);
assertThrows(() => { df.formatRange( "  -0.000e200   ", "  -1e-30    ") }, RangeError);
// 4b. Else if y is negative-infinity, throw a RangeError exception.
assertThrows(() => { df.formatRange( "  -0   ", "  -Infinity    ") }, RangeError);
// other case which won't throw under 4
assertDoesNotThrow(() => { df.formatRange( "  -0   ", "  Infinity    ") })
assertEquals("-0 – ∞", df.formatRange("     -0 ", "  Infinity    "));
assertDoesNotThrow(() => { df.formatRange( "  -0   ", "  -0    ") })
assertDoesNotThrow(() => { df.formatRange( "  -0   ", "  12345    ") })
assertDoesNotThrow(() => { df.formatRange( "  -0   ", "  12345e-30    ") })
assertEquals("-0 – 0", df.formatRange("     -0 ", "  12345e-30    "));
assertDoesNotThrow(() => { df.formatRange( "  -0   ", "  .12345e-30    ") })
assertDoesNotThrow(() => { df.formatRange( "  -0   ", "  .12345e34    ") })
assertEquals("-0 – 12,345,000,000,000,000,000,000,000,000,000",
    df.formatRange("     -0 ", "  .12345e32    "));

// other cases which won't throw not under 2-4
assertDoesNotThrow(() => { df.formatRange( "  -Infinity   ", "  -Infinity    ") })
assertEquals("~-∞", df.formatRange("     -Infinity ", "  -Infinity    "));
assertDoesNotThrow(() => { df.formatRange( "  -Infinity   ", "  -3e20    ") })
assertDoesNotThrow(() => { df.formatRange( "  -Infinity   ", "  -3e20    ") })
assertDoesNotThrow(() => { df.formatRange( "  -Infinity   ", "  -0    ") })
assertDoesNotThrow(() => { df.formatRange( "  -Infinity   ", "  0    ") })
assertDoesNotThrow(() => { df.formatRange( "  -Infinity   ", "  .3e20    ") })
assertDoesNotThrow(() => { df.formatRange( "  -Infinity   ", "  Infinity    ") })
assertEquals("-∞ – ∞", df.formatRange("     -Infinity ", "  Infinity    "));
