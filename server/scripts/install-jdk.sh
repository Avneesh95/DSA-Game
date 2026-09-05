#!/usr/bin/env bash
# Installs a portable JDK into server/.jdk with NO root/apt and NO Docker.
#
# Why this exists: the judge (server/execution/languages.js) shells out to
# `javac`/`java` directly. Render's native Node runtime doesn't ship a JVM
# (see https://render.com/docs/native-runtimes) and native-runtime builds
# don't have apt/root access, so `apt-get install default-jdk` is not an
# option there. Instead, this downloads Eclipse Temurin's pre-built Linux
# x64 JDK tarball and extracts it into ./.jdk — just files on disk, no
# package manager or privileges required. languages.js picks it up
# automatically (see JAVA_BIN/JAVAC_BIN resolution at the top of that file).
#
# Safe to run anywhere (local dev included): it no-ops if ./.jdk already
# has a working javac, so re-running on every Render build is cheap after
# the first deploy (Render caches the persistent build/runtime disk).
#
# Usage: bash server/scripts/install-jdk.sh   (or just: npm run postinstall)

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SERVER_DIR="$(dirname "$SCRIPT_DIR")"
JDK_DIR="$SERVER_DIR/.jdk"
JDK_MAJOR="21"

if [ -x "$JDK_DIR/bin/javac" ]; then
  echo "[install-jdk] JDK already present at $JDK_DIR — skipping download."
  exit 0
fi

# Only meaningful on Linux x64 (Render's build/runtime environment). On any
# other OS (e.g. a developer's Mac laptop) we skip silently and fall back to
# whatever `javac`/`java` is already on PATH for local dev.
OS="$(uname -s)"
ARCH="$(uname -m)"
if [ "$OS" != "Linux" ] || { [ "$ARCH" != "x86_64" ] && [ "$ARCH" != "amd64" ]; }; then
  echo "[install-jdk] Not Linux x64 (detected $OS/$ARCH) — skipping portable JDK download."
  echo "[install-jdk] Local dev will use javac/java from PATH instead; install a JDK yourself if you don't have one."
  exit 0
fi

echo "[install-jdk] Downloading Temurin JDK $JDK_MAJOR (Linux x64)..."
TMP_TAR="$(mktemp)"
trap 'rm -f "$TMP_TAR"' EXIT

# Adoptium's stable "latest release for this feature version" API endpoint.
DOWNLOAD_URL="https://api.adoptium.net/v3/binary/latest/${JDK_MAJOR}/ga/linux/x64/jdk/hotspot/normal/eclipse"

curl -fsSL "$DOWNLOAD_URL" -o "$TMP_TAR"

mkdir -p "$JDK_DIR"
# The tarball's top-level dir is versioned (e.g. jdk-21.0.4+7), so extract
# with --strip-components=1 to land its contents directly in $JDK_DIR.
tar -xzf "$TMP_TAR" -C "$JDK_DIR" --strip-components=1

"$JDK_DIR/bin/javac" -version
echo "[install-jdk] JDK installed at $JDK_DIR"
