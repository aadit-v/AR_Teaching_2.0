/**
 * Hotspot registry for the DNM 8Z100A 4-Stereo-Zone Amplifier.
 *
 * Anchor origin (0, 0, 0) = centre of the 90's Boombox sticker on the MUSIC VOL knob.
 *   -X = further left across the faceplate
 *   +Y = higher up the faceplate
 *   +Z = forward out of the panel (0.05 keeps pins off the plane, no z-fighting)
 *
 * Units are MindAR target units: 1.0 on X == the full width of the tracked sticker.
 * If your printed sticker is a different size than the one these offsets were measured
 * against, scale every X/Y uniformly rather than nudging pins one at a time.
 */

export const CONTROLS_DATA = [
  // --- Main / right area controls ---
  {
    id: 'music-vol',
    name: 'Master Music Volume',
    type: 'knob',
    position: [0.0, 0.0, 0.05],
    description:
      'Main master volume control for the music source before routing to separate zones.',
    instructions: 'Controls overall amplification. Scale ranges from 0 to 34+.',
  },
  {
    id: 'balance',
    name: 'Stereo Balance',
    type: 'knob',
    position: [-0.4, 0.0, 0.05],
    description: 'Controls balance between Left and Right stereo output channels.',
    instructions:
      'Turn left for Left speaker bias, right for Right speaker bias. Keep centered for normal operation.',
  },
  {
    id: 'treble',
    name: 'Treble EQ',
    type: 'knob',
    position: [-0.7, 0.0, 0.05],
    description: 'High-frequency tone adjustment.',
    instructions:
      'Turn towards (+) for brighter, sharper vocals and cymbals; turn towards (-) for softer, duller high tones.',
  },
  {
    id: 'bass',
    name: 'Bass EQ',
    type: 'knob',
    position: [-1.0, 0.0, 0.05],
    description: 'Low-frequency tone adjustment.',
    instructions:
      'Turn towards (+) for deeper, punchier low-end rumble; turn towards (-) to attenuate boomy bass.',
  },
  {
    id: 'mic-vol',
    name: 'Microphone Volume',
    type: 'knob',
    position: [-1.3, 0.0, 0.05],
    description: 'Independent input volume for connected microphone inputs.',
    instructions:
      'Adjusts level for voice announcements independently from background music.',
  },

  // --- Left side: 4 zone volume knobs ---
  {
    id: 'zone-4',
    name: 'Zone 4 Volume',
    type: 'knob',
    position: [-1.75, 0.0, 0.05],
    description: 'Speaker Area: Room 4.',
    instructions: 'Currently set to mute/no sound. Turn clockwise to feed audio to Room 4.',
  },
  {
    id: 'zone-3',
    name: 'Zone 3 Volume',
    type: 'knob',
    position: [-2.05, 0.0, 0.05],
    description: 'Speaker Area: Corridor.',
    instructions: 'Currently set for medium background volume in the hallway/corridor.',
  },
  {
    id: 'zone-2',
    name: 'Zone 2 Volume',
    type: 'knob',
    position: [-2.35, 0.0, 0.05],
    description: 'Speaker Area: Room 2.',
    instructions: 'Configured for low-volume audio output.',
  },
  {
    id: 'zone-1',
    name: 'Zone 1 Volume',
    type: 'knob',
    position: [-2.65, 0.0, 0.05],
    description: 'Speaker Area: Room 1.',
    instructions: 'Primary high-volume speaker zone.',
  },

  // --- Left side switches & ports ---
  {
    id: 'power-switch',
    name: 'Main Power Switch',
    type: 'rocker-switch',
    position: [-3.1, 0.15, 0.05],
    description: 'Rocker switch for primary AC power.',
    instructions: "'I' turns the system ON, 'O' shuts down the amplifier.",
  },
  {
    id: 'usb-port',
    name: 'Media USB Port',
    type: 'port',
    position: [-2.65, 0.45, 0.05],
    description: 'USB Type-A input for flash drives and external storage media.',
    instructions:
      'Insert flash drive containing MP3/WAV files and select ST/USB or MODE to play.',
  },

  // --- Upper centre / media controls ---
  {
    id: 'media-playback',
    name: 'Media Playback Controls',
    type: 'buttons',
    position: [-1.2, 0.45, 0.05],
    description: 'Prev, Next, Play/Pause, and Mode toggle buttons.',
    instructions:
      'Press MODE to cycle between Bluetooth, USB, SD, and FM. Use << and >> to skip tracks.',
  },
  {
    id: 'lcd-display',
    name: 'Status Display',
    type: 'screen',
    position: [-0.65, 0.45, 0.05],
    description:
      'Backlit LCD screen displaying active source, frequency, or track playback data.',
    instructions: 'Monitors active input modes and FM station scanning.',
  },

  // --- Upper right tuner & source selection ---
  {
    id: 'tuner-controls',
    name: 'FM Tuner Section',
    type: 'buttons',
    position: [0.1, 0.45, 0.05],
    description: 'Controls for FM radio tuning (CH-, CH+, AUTO, FM).',
    instructions:
      'Press FM to switch to radio. Tap AUTO to autoscan and store local stations. Cycle with CH- and CH+.',
  },
  {
    id: 'input-selectors',
    name: 'Input Selectors & Loudness',
    type: 'buttons',
    position: [0.55, 0.45, 0.05],
    description: 'Source selection (BT, ST/USB, DVD, CD) and LOUD toggle.',
    instructions:
      'Tap BT to pair smartphone/laptop via Bluetooth. Press LOUD to apply frequency contours for rich sound at low volumes.',
  },
];

/** Lucide icon name + pin tint per control family. */
export const TYPE_STYLES = {
  knob: { icon: 'circle-dot', tint: '#F2A33C', label: 'Rotary knob' },
  'rocker-switch': { icon: 'power', tint: '#E4572E', label: 'Rocker switch' },
  port: { icon: 'usb', tint: '#6FD3C7', label: 'Input port' },
  buttons: { icon: 'square-mouse-pointer', tint: '#8FB8FF', label: 'Button cluster' },
  screen: { icon: 'monitor', tint: '#A6E22E', label: 'Display' },
};

export const getControl = (id) => CONTROLS_DATA.find((c) => c.id === id);
