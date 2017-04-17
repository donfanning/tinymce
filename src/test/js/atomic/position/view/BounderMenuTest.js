test(
  'BounderMenuTest',

  [
    'ephox.alloy.positioning.layout.Bounds',
    'ephox.alloy.positioning.layout.Bubble',
    'ephox.alloy.positioning.layout.LinkedLayout',
    'ephox.alloy.positioning.view.Bounder'
  ],

  function (Bounds, Bubble, LinkedLayout, Bounder) {
    var check = function (expected, preference, anchor, panel, bubbles, bounds) {
      var actual = Bounder.attempts(preference, anchor, panel, bubbles, bounds);
      assert.eq(expected.label, actual.label());
      assert.eq(expected.x, actual.x());
      assert.eq(expected.y, actual.y());
      if (expected.candidateYforTest !== undefined) assert.eq(expected.candidateYforTest, actual.candidateYforTest());
    };

    // LinkedLayout is for submenus (vertically aligned to opposite side of menu)
    var four = [ LinkedLayout.southeast, LinkedLayout.southwest, LinkedLayout.northeast, LinkedLayout.northwest ];

    // empty input array is now invalid, just returns anchor coordinates
    check({
      label: 'none',
      x: 0,
      y: 0
    }, [], Bounds(0, 0, 10, 10), Bounds(0, 0, 50, 50), Bubble(0, 0), Bounds(0, 0, 1000, 1000));

    check({
      label: 'none',
      x: 100,
      y: 0
    }, [], Bounds(100, 0, 200, 50), Bounds(0, 0, 150, 25), Bubble(10, 0), Bounds(0, 0, 1000, 1000));

    var panelBox = Bounds(0, 0, 100, 75);
    var bigPanel = Bounds(0, 0, 75, 500);
    var view = Bounds(50, 50, 350, 220);
    var bubb = Bubble(0, 0);

    // Southeast.
    check({
      label: 'link-layout-se',
      x: 100 + 2,
      y: 55
    }, four, Bounds(100, 55, 2, 2), panelBox, bubb, view);

    // Southwest.
    check({
      label: 'link-layout-sw',
      x: 320 - 100,
      y: 55
    }, four, Bounds(320, 55, 2, 2), panelBox, bubb, view);

    // Northeast.
    check({
      label: 'link-layout-ne',
      x: 140 + 2,
      y: 235 + 2 - 75
    }, four, Bounds(140, 235, 2, 2), panelBox, bubb, view);

    // Northwest.
    check({
      label: 'link-layout-nw',
      x: 320 - 100,
      y: 235 + 2 - 75
    }, four, Bounds(320, 235, 2, 2), panelBox, bubb, view);

    // All fit -> southeast because of order of preference.
    check({
      label: 'link-layout-se',
      x: 350 - 100, // 270 + 2, capped at view width
      y: 100
    }, four, Bounds(270, 100, 2, 2), panelBox, bubb, view);

    // None near top left -> best fit is southeast
    check({
      label: 'link-layout-se',
      x: 55 + 2,
      y: 55
    }, four, Bounds(55, 55, 2, 2), bigPanel, bubb, view);

    // None near top right -> best fit is southwest
    check({
      label: 'link-layout-sw',
      x: 350 - 75,
      y: 55
    }, four, Bounds(350, 55, 2, 2), bigPanel, bubb, view);

    // None near bottom left -> best fit is northeast
    check({
      label: 'link-layout-ne',
      x: 55 + 2,
      y: 50,
      candidateYforTest: 200 + 2 - 500
    }, four, Bounds(55, 200, 2, 2), bigPanel, bubb, view);

    // None near bottom right -> best fit is northwest
    check({
      label: 'link-layout-nw',
      x: 350 - 75,
      y: 50,
      candidateYforTest: 200 + 2 - 500
    }, four, Bounds(350, 200, 2, 2), bigPanel, bubb, view);


    // Southeast (1px short on x and y).
    check({
      label: 'link-layout-se',
      x: 350 - 100, // 350+50-2-101 + 2, capped at view width
      y: 220+50-76
    }, four, Bounds(350+50-2-101, 220+50-76, 2, 2), panelBox, bubb, view);

    // Southeast (exactly for x and y).
    check({
      label: 'link-layout-se',
      x: 350 - 100, // 350+50-2-100 + 2,
      y: 220+50-75
    }, four, Bounds(350+50-2-100, 220+50-75, 2, 2), panelBox, bubb, view);

    // Southeast -> Southwest (1px too far on x).
    check({
      label: 'link-layout-sw',
      x: 350+50-2-99 - 100,
      y: 220+50-75
    }, four, Bounds(350+50-2-99, 220+50-75, 2, 2), panelBox, bubb, view);

    // Southeast -> Northeast (1px too far on y).
    check({
      label: 'link-layout-ne',
      x: 350 - 100, // 350+50-100, capped at view width
      y: 220+50-74 + 2 - 75
    }, four, Bounds(350+50-2-100, 220+50-74, 2, 2), panelBox, bubb, view);

    // Southeast -> Northwest (1px too far on x and y).
    check({
      label: 'link-layout-nw',
      x: 350+50-2-99 - 100,
      y: 220+50-74 + 2 - 75
    }, four, Bounds(350+50-2-99, 220+50-74, 2, 2), panelBox, bubb, view);
  }
);