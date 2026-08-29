---
title: "I Couldn't Get a Free Server, So I Rooted a Dead Phone Instead"
postKey: "post-5"
excerpt: "Part 1 of 2: bootloader unlocking, Magisk, and the kernel config that killed my Docker plans."
coverImage: "/assets/blog/rooting-a-dead-phone-into-a-server/cover.png"
date: "2026-08-28T10:00:00.000Z"
author:
  name: Gagan S
  picture: "/assets/blog/authors/gagan_img1.jpeg"
ogImage:
  url: "/assets/blog/rooting-a-dead-phone-into-a-server/cover.png"
---

---

## The server that didn't exist

I wanted somewhere to run a Go service. Nothing heavy — an API, a River job queue, a worker process. The kind of thing that would be bored on any real machine.

Oracle Cloud's Always Free tier looked perfect. They give away an Ampere A1 instance: four ARM cores and 24 GB of RAM, permanently, for nothing. People run entire homelabs on it. I made an account, walked through the instance creation wizard, picked `VM.Standard.A1.Flex`, dialled it down to a modest 2 OCPU / 12 GB to be polite about it, and hit Create.

> **Out of host capacity.**

I tried again. Same thing. I tried a smaller shape. Same thing.

Here's the part that took me a while to understand: Always Free compute has to live in your tenancy's *home region*. Mine was Hyderabad. Hyderabad has exactly one availability domain. So the usual advice — "try a different AD, it's just capacity pressure" — didn't apply. There was no other AD to try. Mumbai exists, but a free-tier tenancy is limited to one subscribed region, and Always Free compute has to be in the home region anyway. Creating a paid VM in Mumbai to route around a free-tier limit rather defeats the point.

The consolation prize was `VM.Standard.E2.1.Micro`: one AMD core, 1 GB of RAM. I created one. It exists. It is not a machine you compile Go on.

So I sat there with a browser tab full of capacity errors, and I opened the drawer where old electronics go to die.

---

## What's actually inside a Galaxy M30s

There was a Samsung Galaxy M30s in there. Indian dual-SIM model, `SM-M307F/DS`. I'd stopped using it a couple of years earlier. It still charged.

The spec sheet is more interesting than I expected:

```
Galaxy M30s (SM-M307F/DS)
─────────────────────────
SoC:      Exynos 9611
Cores:    8 (ARM64)
RAM:      4 GB physical
Storage:  64 GB + microSD
Android:  11
Kernel:   Linux 4.14.113
```

Eight ARM cores and 4 GB of RAM. Compare that to the E2.1.Micro I'd just been given: one core, 1 GB. The dead phone in my drawer was, on paper, four to eight times the machine that Oracle's free tier had actually offered me.

It also has a battery, which is a genuinely nice property in a server. A phone is a small computer with a built-in UPS.

So the question became: how much of a Linux server can I actually get out of this thing?

---

## The question I should have asked first

My original plan was Docker. My project already had a `docker-compose.yml`. I'd just `docker compose up` on the phone and be done.

I want to be honest that this was the assumption I spent the most time on, and it was wrong, and finding out *why* it was wrong turned out to be the most educational part of the whole exercise.

Docker isn't magic. It's a userspace program that asks the Linux kernel for a specific set of features: namespaces to isolate processes, cgroups to constrain them, `veth` pairs and a bridge to network them, OverlayFS to stack their filesystems. If the kernel doesn't offer those features, Docker has nothing to stand on.

Android runs a Linux kernel. But it runs a *vendor* Linux kernel, compiled by Samsung, for a phone, with a config that reflects what a phone needs. Nobody at Samsung was thinking about containers when they built the M30s kernel in 2019.

I didn't know yet whether the features were there. To find out, I needed root. To get root, I needed to unlock the bootloader. And unlocking the bootloader on a Samsung means committing to a few things that don't come back.

---

## Committing to the wipe

Three things happen when you unlock a Samsung bootloader:

1. **All user data is erased.** Not optional, not recoverable.
2. **The Knox warranty bit is permanently tripped.** This is a physical efuse. It does not un-blow. Samsung Pay and Secure Folder stop working forever, on that device, even if you flash back to stock.
3. **You take on the responsibility of not bricking it.**

For a phone I actively used, none of that would have been acceptable. For a phone that had been in a drawer for two years, all three were fine. I backed up the handful of photos still on it and stopped worrying.

The unlock itself is a sequence of button presses that feels absurdly low-tech for something this consequential:

- Settings → About phone → Software information → tap **Build number** seven times to enable Developer options.
- Developer options → enable **OEM unlocking**. (If this toggle is missing, the phone hasn't been online long enough — Samsung gates it behind a check that needs a few days of uptime and a signed-in account.)
- Power off. Hold **Volume Up + Volume Down** and plug in the USB cable.

That drops you into Download Mode, which is Samsung's flashing interface: a plain text screen on a black background. Mine said:

```
PRODUCT NAME:     SM-M307F
CURRENT BINARY:   Samsung Official
OEM LOCK:         ON(U)
Secure Download:  Enabled
CARRIER_ID:       INS
RP SWREV:         B:4 K:4 S:4
```

`OEM LOCK: ON(U)` is the state you want before unlocking — locked, but *unlockable*, because the developer-options toggle is on. `OFF (U)` is what you get afterwards.

`RP SWREV: B:4 K:4 S:4` matters more than it looks. That's the anti-rollback revision. The bootloader will refuse firmware older than binary 4. Flash the wrong build and you get a phone that won't boot and can't be downgraded back out of it.

Then: long-press **Volume Up**. Not a tap — a hold. A second warning screen appears. Confirm with Volume Up again.

The phone wipes itself and reboots. On the way up it shows a warning about an unlocked bootloader, which is expected and which it will now show on every single boot for the rest of its life.

---

## Getting the exact firmware, before touching anything

Rooting a Samsung with Magisk doesn't work the way rooting a Pixel does. There's no `fastboot boot patched_boot.img`. Samsung's process is:

1. Download the **exact** stock firmware your phone is running.
2. Copy the AP file from it to the phone.
3. Let the Magisk app patch that AP file.
4. Flash the patched AP back, alongside the untouched BL / CP / CSC files, using Odin on Windows.

Step 1 is the one people skip, and it's the one that saves you. Before modifying the boot image, get a known-good copy of the boot image.

Mine was `SM-M307F / INS / M307FXXS4CWC2` — binary 4, matching the `B:4` on the download screen. That's a ~4 GB archive from one of the Samsung firmware mirrors. Extracted, it gives you five files:

```
AP_M307FXXS4CWC2_....tar.md5     ← the one Magisk patches
BL_M307FXXS4CWC2_....tar.md5
CP_M307FXXS4CWC1_....tar.md5
CSC_OMC_....tar.md5
HOME_CSC_OMC_....tar.md5
```

The distinction between `CSC` and `HOME_CSC` is worth knowing: `CSC` wipes user data, `HOME_CSC` preserves it. Since the unlock had already wiped everything, it didn't matter here, but on a phone you care about it very much does.

Then, on the phone: install the official Magisk APK from GitHub (not from a random mirror — this is the one file where supply chain actually matters), copy the AP tarball across, open Magisk, tap **Install → Select and Patch a File**, point it at the AP.

Magisk unpacks the tarball, finds the boot/recovery image inside, injects itself into the ramdisk, and repacks it as `magisk_patched-XXXXX_XXXXX.tar` in your Downloads folder. Copy that back to the PC. Don't open it, don't rename it, don't let Windows helpfully re-compress anything.

---

## Odin, and the ninety seconds where you find out

Odin is Samsung's flashing tool. It is a Windows executable from a decade ago with five buttons and no undo. Before it'll see anything you need the Samsung USB drivers installed.

The load-out:

```
BL   → BL_M307FXXS4CWC2_....tar.md5
AP   → magisk_patched-XXXXX_XXXXX.tar     ← the patched one
CP   → CP_M307FXXS4CWC1_....tar.md5
CSC  → HOME_CSC_OMC_....tar.md5
```

AP is a large file and Odin takes a minute to hash it. Nothing appears to happen. Let it finish.

In the Options tab: **Auto Reboot** on, **Re-Partition** off. Re-Partition being off is not a stylistic preference. Leave it checked with a mismatched PIT and you will learn a great deal about Samsung's service centres.

Phone back into Download Mode, USB connected, Odin's ID:COM box turns blue. Press Start.

Then you watch a progress bar and think about your life choices for about ninety seconds. `PASS!` appeared. The phone rebooted itself into Android's first-run setup, which is a strange thing to see on a device you were fairly sure you'd just destroyed.

Skipped through setup, opened the Magisk app, and it reported that Magisk was installed and active.

The phone was rooted.

---

## The five lines that ended the Docker plan

Now the actual question. I installed Termux — the `arm64-v8a` build from the official GitHub releases, **not** the Play Store version, which has been abandoned for years and will break in confusing ways. Then, from a root shell, I went looking for the kernel config.

Android exposes it at `/proc/config.gz` if the kernel was built with `CONFIG_IKCONFIG_PROC`. Mine was:

```bash
zcat /proc/config.gz | grep -E \
  'USER_NS|VETH|BRIDGE|OVERLAY_FS|CGROUP_DEVICE|NAMESPACES|PID_NS|NET_NS'
```

The good news:

```
CONFIG_NAMESPACES=y
CONFIG_UTS_NS=y
CONFIG_PID_NS=y
CONFIG_NET_NS=y
CONFIG_CGROUPS=y
CONFIG_CGROUP_FREEZER=y
CONFIG_CGROUP_CPUACCT=y
```

The bad news:

```
# CONFIG_USER_NS is not set
# CONFIG_VETH is not set
# CONFIG_BRIDGE is not set
# CONFIG_OVERLAY_FS is not set
# CONFIG_CGROUP_DEVICE is not set
```

That's not a "needs some tweaking" result. That's five load-bearing walls missing:

- **No `USER_NS`** — no user namespaces, so no rootless containers and no UID remapping.
- **No `VETH`, no `BRIDGE`** — no virtual ethernet pairs, no `docker0`. Container networking as Docker implements it simply cannot be constructed.
- **No `OVERLAY_FS`** — no layered images. This is the thing that makes a Docker image a stack of diffs instead of a full filesystem copy.
- **No `CGROUP_DEVICE`** — no per-container device access control.

And the cgroups that *do* exist aren't where a Linux userspace expects them. Android mounts its own hierarchy:

```
/dev/cpuctl
/dev/cpuset
/dev/memcg
/dev/freezer
/dev/stune
/acct
```

instead of a conventional `/sys/fs/cgroup`. Android uses cgroups aggressively for its own power and priority management, and it has arranged them for its own convenience.

You *can* fix all of this. The fix is compiling a custom kernel with the right config and flashing it. For an Exynos 9611 with a 4.14 vendor tree, that's not an afternoon — that's a different project entirely, and a much harder one.

So Docker was out.

---

## Which turned out to be the good outcome

I want to dwell on this, because it reframed the whole exercise for me.

I have used Docker daily for years. I have written Dockerfiles, debugged compose networking, argued about layer caching. And I had never once had to know that `veth` and OverlayFS were things, let alone that they were *kernel config options that could be absent*.

Docker had been, functionally, a magic box. Type command, get isolated environment. The abstraction was so good I'd never had a reason to look underneath it.

Grepping a kernel config and watching Docker become impossible, line by line, taught me more about what containers actually *are* than any amount of successful `docker run` ever had. Containers aren't a technology. They're a name for a particular combination of six or seven kernel features being used together. Take three away and there's nothing there.

I didn't need Docker anyway. I needed a Linux userspace to run a Go binary in.

---

## Debian, without a kernel

The tool for that is `proot-distro`, a Termux package that installs a full distro rootfs and runs it under PRoot.

PRoot is worth understanding properly, because it is *not* a container and it is *not* a VM, and every later problem I hit came from that difference.

`chroot` needs root and changes the actual root directory via a syscall. PRoot needs neither. It uses `ptrace` to intercept every syscall a process makes and rewrite the paths in it. Your program asks for `/etc/hostname`, PRoot quietly turns that into `/data/data/com.termux/files/usr/var/lib/proot-distro/.../etc/hostname`, and the program is none the wiser.

It's an illusion maintained one syscall at a time. It costs performance. But it means you get a real Debian filesystem — real `apt`, real `/usr/local`, real users and permissions — with no kernel changes and no root required.

```bash
pkg update
pkg install proot-distro
proot-distro install debian
proot-distro login debian
```

A few minutes of downloading later:

```
root@localhost:~# cat /etc/os-release
PRETTY_NAME="Debian GNU/Linux 12 (bookworm)"

root@localhost:~# uname -m
aarch64
```

Debian userspace, Android kernel:

```
┌──────────────────────────────┐
│ Debian bookworm (userspace)  │
│ apt · Go · your binaries     │
└──────────────┬───────────────┘
               │  proot (ptrace syscall rewriting)
┌──────────────▼───────────────┐
│ Android 11 / Linux 4.14.113  │
└──────────────┬───────────────┘
               │
        Exynos 9611 · 4 GB
```

One quirk that confused me for a minute: `uname -r` *inside* Debian reports something like `6.17.0-PRoot-Distro`. That's PRoot lying, because some software refuses to run on old kernels and PRoot would rather not have that argument. The real kernel underneath is still 4.14.113. This lie matters later — it's exactly why Tailscale failed inside Debian, but that's Part 2's problem.

Then the ordinary sysadmin bit. Debian drops you in as root; running an application server as root is a bad habit even on a phone:

```bash
apt update && apt upgrade -y
apt install -y curl git nano sudo

useradd -m -s /bin/bash astraxx
passwd astraxx
usermod -aG sudo astraxx
su - astraxx
```

The thing to internalise here is that **there is no `systemd`**. `systemctl` exists as a binary and does nothing useful. PID 1 in this environment isn't an init system. Every service you want running, you will start yourself, and keep running yourself. I'd never thought about how much systemd was doing until I had to replace it by hand.

---

## Finding 13 GB of memory in a 4 GB phone

`free -h` inside Debian showed about 3.5 GiB total, of which Android was already using a healthy chunk. Compiling Go is not a low-memory activity. This was going to be a problem, and it was — spectacularly, in Part 2.

Android already runs zRAM: a compressed block device in RAM used as swap. Mine was configured at 3 GiB. Tempting to resize, but zRAM is live and Android depends on it, and detaching a busy zram device on a running phone is a good way to hard-reboot your phone.

Better idea: leave zRAM alone and add a disk-backed swapfile beside it. There were ~36 GB free on `/data`, so from a root shell on Android (not inside Debian):

```bash
cd /data/local/tmp
dd if=/dev/zero of=swapfile bs=1M count=10240
chmod 600 swapfile
mkswap swapfile
swapon /data/local/tmp/swapfile
```

I half expected `swapon` to be rejected — Android's `/data` filesystem and kernel don't have to allow this. It worked:

```
$ cat /proc/swaps
Filename                    Type       Size      Used  Priority
/dev/block/zram0            partition  3145724   1024  -2
/data/local/tmp/swapfile    file       10485756  0     -3
```

```
RAM        3.5 GiB
zRAM       3.0 GiB
swapfile  10.0 GiB
──────────────────
Total     ~16.5 GiB addressable
```

Two caveats worth writing on the wall:

- **It does not survive a reboot.** No `/etc/fstab` here. After every restart you `su` and `swapon` again.
- **Do not delete the file while it's active.** Obviously. But it lives in `/data/local/tmp`, which is exactly the sort of directory a person cleans out without thinking.

---

## Getting off the phone's screen

Everything up to here I did by tapping a virtual keyboard on a 6-inch screen, which is a form of penance. Termux ships an SSH server. Port 8022, because 22 is privileged and Termux isn't root:

```bash
pkg install openssh
passwd          # set a Termux password
ip addr show wlan0
sshd
```

From the Mac:

```bash
ssh -p 8022 <phone-wifi-ip>
```

And there it was — a shell on the phone, from a real keyboard. From there:

```bash
proot-distro login debian -- su - astraxx
```

Two hops: SSH into Termux, then PRoot into Debian, then `su` to the app user. A slightly silly stack, but a working one.

Later I replaced the raw IP with Tailscale, so the phone is reachable by name from anywhere without caring what the router hands it. That also comes with a good failure story, and it's in Part 2.

---

## Where this leaves us

At the end of the first day, the drawer phone was:

- bootloader unlocked, Knox permanently tripped, warranty conceptually vaporised
- rooted with Magisk
- running Termux with SSH on 8022
- hosting a Debian bookworm userspace under PRoot
- carrying about 13 GB of swap
- reachable from my Mac with a real keyboard

And definitively, provably unable to run Docker — which I now understand for concrete reasons rather than as a vague "Android is different."

What it did *not* have yet was anything worth running. That's Part 2: getting a real Go service on it, discovering that `go build` will happily kill your SSH session, replacing systemd with tmux, and putting the whole thing on the public internet through a Cloudflare Tunnel — with no ports open on my router and no static IP.

It ends with the funniest bug I've hit all year.

---

*[Part 2](/posts/running-a-go-service-on-a-phone): Running a Go API, a River job queue, and a public HTTPS endpoint on a phone with no systemd.*
