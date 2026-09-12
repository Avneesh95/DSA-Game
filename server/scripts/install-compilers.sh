#!/usr/bin/env bash
# Installs portable JDK and C/C++ compiler toolchains into server/.jdk and server/.compilers
# with NO root/apt and NO Docker required. Works on Render's native Node runtime.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SERVER_DIR="$(dirname "$SCRIPT_DIR")"
JDK_DIR="$SERVER_DIR/.jdk"
COMPILERS_DIR="$SERVER_DIR/.compilers"
JDK_MAJOR="21"

OS="$(uname -s)"
ARCH="$(uname -m)"

# ── 1. Portable JDK (Temurin 21) ──
if [ -x "$JDK_DIR/bin/javac" ]; then
  echo "[install] JDK already present at $JDK_DIR — skipping download."
else
  if [ "$OS" = "Linux" ] && { [ "$ARCH" = "x86_64" ] || [ "$ARCH" = "amd64" ]; }; then
    echo "[install] Downloading Temurin JDK $JDK_MAJOR (Linux x64)..."
    TMP_TAR="$(mktemp)"
    DOWNLOAD_URL="https://api.adoptium.net/v3/binary/latest/${JDK_MAJOR}/ga/linux/x64/jdk/hotspot/normal/eclipse"
    curl -fsSL "$DOWNLOAD_URL" -o "$TMP_TAR"
    mkdir -p "$JDK_DIR"
    tar -xzf "$TMP_TAR" -C "$JDK_DIR" --strip-components=1
    rm -f "$TMP_TAR"
    "$JDK_DIR/bin/javac" -version || true
    echo "[install] JDK installed at $JDK_DIR"
  fi
fi

# ── 2. Portable C/C++ Compiler (Musl GCC/G++ or Zig) ──
if [ -x "$COMPILERS_DIR/bin/g++" ] || [ -x "$COMPILERS_DIR/bin/x86_64-linux-musl-g++" ] || [ -x "$COMPILERS_DIR/zig" ]; then
  echo "[install] C/C++ compiler already present at $COMPILERS_DIR — skipping download."
else
  if [ "$OS" = "Linux" ] && { [ "$ARCH" = "x86_64" ] || [ "$ARCH" = "amd64" ]; }; then
    if command -v g++ >/dev/null 2>&1; then
      echo "[install] System g++ found ($(g++ --version | head -n1))."
    else
      echo "[install] Downloading portable C/C++ compiler (GCC/G++ Linux x64)..."
      TMP_GCC="$(mktemp)"
      # Download static musl GCC/G++ toolchain (.tgz)
      GCC_URL="https://musl.cc/x86_64-linux-musl-native.tgz"
      if curl -fsSL "$GCC_URL" -o "$TMP_GCC"; then
        mkdir -p "$COMPILERS_DIR"
        tar -xzf "$TMP_GCC" -C "$COMPILERS_DIR" --strip-components=1
        rm -f "$TMP_GCC"
        echo "[install] Portable GCC/G++ installed at $COMPILERS_DIR"
      else
        echo "[install] Fallback: downloading portable Zig C++..."
        ZIG_URL="https://ziglang.org/download/0.11.0/zig-linux-x86_64-0.11.0.tar.xz"
        curl -fsSL "$ZIG_URL" -o "$TMP_GCC"
        mkdir -p "$COMPILERS_DIR"
        tar -xf "$TMP_GCC" -C "$COMPILERS_DIR" --strip-components=1 || true
        rm -f "$TMP_GCC"
        echo "[install] Portable Zig C++ downloaded at $COMPILERS_DIR"
      fi
    fi
  fi
fi
