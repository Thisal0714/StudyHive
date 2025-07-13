# Timer Audio Files

This directory contains audio files for the StudyHive timer functionality.

## Required Files

- `timer-complete.wav` - Sound that plays when the study session timer completes

## How to Add Your Own Timer Sound

1. **Find a suitable audio file**: Look for short (1-3 second) notification sounds that are:
   - Not too jarring or loud
   - Clear and recognizable
   - In WAV or MP3 format (WAV recommended for better compatibility)

2. **Recommended sources for free sounds**:
   - [Freesound.org](https://freesound.org/) - Community-driven sound library
   - [Mixkit](https://mixkit.co/free-sound-effects/) - Free sound effects
   - [Zapsplat](https://www.zapsplat.com/) - Professional sound library
   - [Notification Sounds](https://notificationsounds.com/) - Dedicated notification sounds

3. **Replace the placeholder**:
   - Download your chosen audio file
   - Rename it to `timer-complete.wav` (or update the code to use your preferred format)
   - Replace the existing placeholder file in this directory

4. **Audio specifications**:
   - Format: WAV or MP3 (WAV recommended)
   - Duration: 1-3 seconds
   - Volume: Moderate (not too loud)
   - Quality: 44.1kHz sample rate or higher

## Testing

Once you've added the audio file, you can test it by:
1. Going to the dashboard
2. Clicking "Start Study Session"
3. Clicking the "🔊 Test Sound" button in the timer modal

The sound will also automatically play when your study session timer completes.

## Fallback Sound

If no audio file is found or if the browser blocks audio playback, the app will automatically play a built-in beep sound using the Web Audio API. This ensures you'll always get a notification when your timer completes. 