## Aletheia-Mobile

<div style="display: flex; gap: 10px">
    <img src="https://github.com/apeitheo/aletheia-mobile/blob/main/screenshot2.png" width="48%" alt="Aletheia-Mobile Screenshot">
    <img src="https://github.com/apeitheo/aletheia-mobile/blob/main/screenshot.png" width="48%" alt="Aletheia-Mobile Screenshot">
</div>

## Dependencies

* **mpv**
* **nodejs**
* **bash**
* **inotify-tools**
* **calc**
* **bc**
* **jq**
* **git**
* **socat**
* **ffmpeg**
* **exiftool**
* **espeak-ng**

## Setting Music Directory

Add or modify the following line in ~/.aletheia-mobile/config:

```bash
MUSIC_DIR=/full/linux/path
```

## Setting Language

Add or modify the following line in ~/.aletheia-mobile/config:

```bash
LANGUAGE=German
```

Available options are English, German, Spanish, Hindi, Chinese, and Japanese.

## Key Controls

Aletheia-Mobile features a robust set of Vim-inspired keybindings for seamless control over your music's pitch, tempo, and playback.

### Interval & Precision Tuning
| Key | Action |
| :--- | :--- |
| `j` | Shift pitch/tempo **down** by 1/60th interval |
| `k` | Shift pitch/tempo **up** by 1/60th interval |
| `y` | Reset/Return to **60-EDO** (Equal Division of the Octave) |
| `o` | **Double** the current precision |
| `m` | **Halve** the current precision |

### Navigation & Playback
| Key | Action |
| :--- | :--- |
| `h` | Seek **5% backward** |
| `l` | Seek **5% forward** |
| `n` | Skip to the **next** song |
| `b` | Return to the **previous** song |
| `Space` | Toggle **Simplified View** |

### Playlist & System
| Key | Action |
| :--- | :--- |
| `;` | Open the **Playlist Editor** |
| `Enter` | **Jump to song** (while in Playlist Editor) |
| `8` | Software Volume **Down** |
| `9` | Software Volume **Up** |

## Android/Termux

### Termux Requirements
* **bc**
* **calc**
* **espeak**
* **exiftool**
* **ffmpeg**
* **mpv**
* **nodejs**
* **inotify-tools**
* **socat**
* **jq**

```bash
pkg update
pkg upgrade
pkg install bc calc espeak exiftool ffmpeg mpv nodejs inotify-tools socat jq
```

## Slackware

### SlackBuilds.org Dependencies
* **mpv**
* **calc**
* **nodejs**
* **exiftool**
* **jq**

### Create Package

```bash
./create_archive
sudo ./aletheia-mobile.SlackBuild
```

## RHEL/Fedora (Requires RPMFusion)

```bash
sudo dnf install rpm-build
sudo ./create_rpm
sudo dnf install ./aletheia-mobile-*.noarch.rpm
```

## SLES/openSUSE

```bash
sudo zypper install rpm-build
sudo ./create_rpm
sudo zypper install ./aletheia-mobile-*.noarch.rpm
```

## Ubuntu/Debian Install

```bash
sudo ./create_deb
sudo apt install /tmp/aletheia-mobile-*.deb
```
