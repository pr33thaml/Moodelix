# Sound Effects Setup Guide

## Folder Structure
Create the following folder structure in your project:

```
public/
  sounds/
    click.mp3       # First click sound (alternates with click 2)
    click 2.mp3     # Second click sound (alternates with click)
    exit.mp3        # Sound when closing panels
    toggle.mp3      # Sound when toggling settings
```

## Supported Audio Formats
- MP3 (recommended)
- WAV
- OGG
- M4A

## How It Works
1. **Click Sound**: Alternates between two click sounds for variety
2. **Exit Sound**: Plays when closing settings panel, music player, or other overlays
3. **Toggle Sound**: Plays when toggling settings (like sound effects on/off)

## Volume Control
- Default volume is set to 30% (0.3)
- You can adjust this in the `useSoundEffects` hook

## Troubleshooting
- If sounds don't play, check browser autoplay policies
- Ensure audio files are properly formatted and not corrupted
- Check browser console for any audio-related errors

## Customization
You can modify the sound effects by:
- Changing the volume in the hook
- Adding new sound types
- Modifying the timing of typing sounds
- Adding sound effects to other components
- Toggling sound effects on/off in settings

## Quote Timing
- Each quote is displayed for 8 seconds before switching to the next
- Typing animation plays for each character (no sound effects)
- Sound effects can be disabled globally via the settings panel
