---
title: "Running a Real Go Service on a Phone With No systemd"
postKey: "post-6"
excerpt: "Part 2 of 2: OOM-killed builds, port collisions, tmux as an init system, and putting a rooted Galaxy M30s on the public internet."
coverImage: "/assets/blog/running-a-go-service-on-a-phone/cover.png"
date: "2026-08-29T10:00:00.000Z"
author:
  name: Gagan S
  picture: "/assets/blog/authors/gagan_img1.jpeg"
ogImage:
  url: "/assets/blog/running-a-go-service-on-a-phone/cover.png"
---

---

In [Part 1](/posts/rooting-a-dead-phone-into-a-server), I unlocked and rooted a Galaxy M30s that had been in a drawer for two years, discovered its kernel was missing five features Docker fundamentally requires, and settled for a Debian userspace running under PRoot inside Termux. It had 13 GB of swap and an SSH server on port 8022.

What it didn't have was anything to run.

This part is about getting a real application onto it. Not a hello-world — an actual Go API with a background job queue, reachable over HTTPS from anywhere, that stays up when I close my laptop.

Almost none of it worked the first time.

---

## The application

I won't go into what the service actually does — it isn't the interesting part. What matters is its shape, which is the shape a lot of Go backends have:

- an **API** process serving HTTP
- a **worker** process running [River](https://riverqueue.com/), a Postgres-backed job queue for Go
- **River UI**, the web dashboard for inspecting queues and retrying jobs
- **PostgreSQL**
- a handful of **binary dependencies** the application shells out to for media handling — `ffprobe` for pulling duration and metadata out of uploads, `pdftoppm` for rendering PDF previews

Go 1.26.6. Normally deployed with `docker compose up`. Which, per Part 1, was not going to happen.

That last bullet turned out to matter more than I expected, so I'll come back to it.

So the first decision was what to do about the database.

---

## Not running Postgres on the phone

I'd originally planned to install Postgres in the Debian environment. I got as far as `apt install postgresql` before backing out and removing it.

Two reasons. The obvious one: Postgres on a 4 GB phone, competing with a Go compiler, is asking a lot. The less obvious one: **no systemd**. Postgres on Debian is packaged around `systemctl`, `pg_ctlcluster`, and a service lifecycle that doesn't exist under PRoot. I'd have been hand-rolling startup scripts for a database on a device that can lose power at Android's discretion.

I moved the database to [Neon](https://neon.tech/) — hosted Postgres with a usable free tier. The phone became a pure application server:

```
        Internet
           │
    ┌──────▼──────┐        ┌─────────────┐
    │  M30s       │───────▶│  Neon       │
    │  API        │        │  Postgres   │
    │  Worker     │        │             │
    │  River UI   │        └─────────────┘
    └─────────────┘
```

**One trap worth documenting.** Neon gives you two connection strings: a direct one and a pooled one, the pooled one being `-pooler` in the hostname. The pooled endpoint is PgBouncer in transaction mode, and PgBouncer in transaction mode breaks prepared statements. With River — which leans on them heavily — you get:

```
pq: unnamed prepared statement does not exist
```

intermittently, under load, in a way that looks like an application bug for a good while before you think to check which connection string you pasted. **Use the direct connection string.**

---

## The Go toolchain

Debian bookworm packages Go 1.19. The project needs 1.26.6. Not close enough.

Remove the packaged version and install the official ARM64 tarball:

```bash
apt remove -y 'golang*' && apt autoremove -y

cd /tmp
curl -LO https://go.dev/dl/go1.26.6.linux-arm64.tar.gz
rm -rf /usr/local/go
tar -C /usr/local -xzf go1.26.6.linux-arm64.tar.gz
```

PATH needs setting in two places, because PRoot's login shells don't reliably source what you'd expect:

```bash
echo 'export PATH=/usr/local/go/bin:$HOME/go/bin:$PATH' > /etc/profile.d/go.sh
echo 'export PATH=/usr/local/go/bin:$HOME/go/bin:$PATH' >> /home/astraxx/.bashrc
```

```
astraxx@localhost:~$ go version
go version go1.26.6 linux/arm64
```

A full ARM64 Go toolchain, on a phone, from a drawer. That felt like a milestone.

For cloning I set up an SSH deploy key rather than fighting HTTPS credential prompts on a device with no browser I wanted to log into:

```bash
ssh-keygen -t ed25519 -C "m30s"
cat ~/.ssh/id_ed25519.pub    # → GitHub → Settings → SSH keys
git clone git@github.com:you/repo.git
```

Then `go mod download`. Then the build.

---

## The dependencies that weren't in go.mod

Here's the one I nearly missed.

`go.mod` describes the Go dependency graph, and that's all it describes. My application also shells out to two binaries at runtime: `ffprobe`, to read duration and codec metadata off uploaded media, and `pdftoppm`, to render the first page of a PDF as a preview image.

Neither of those appears anywhere in the Go module graph. They appeared in the `Dockerfile`:

```dockerfile
FROM golang:1.26-alpine
RUN apk add --no-cache git ffmpeg curl poppler-utils
```

One line, easy to skim past, and the reason the application had never once failed to find `ffprobe` in three years of development. The image always had it.

Take Docker away and that line has to go somewhere. In my case, into a Debian shell by hand:

```bash
apt update
apt install -y git curl ffmpeg poppler-utils
```

```
git             → git
curl            → curl
ffmpeg          → ffprobe
poppler-utils   → pdftoppm
```

Verify before you build anything, because the failure mode is nasty — the application starts fine, serves fine, and then silently degrades the first time someone uploads a video:

```bash
ffprobe -version
pdftoppm -v
```

Both had ARM64 packages in bookworm, so this was painless. It wouldn't have been if either had needed compiling — `ffmpeg` from source on this phone would have made the Go build look brisk.

**The general point:** a container image is a dependency manifest that most of us never read as one. `go.mod`, `package.json`, `requirements.txt` — we treat those as *the* list of what a service needs. But every `apt install` and `apk add` in your Dockerfile is a dependency too, and it's the one you find out about by accident. Reading my own Dockerfile as a checklist rather than as build config was a useful shift.

---

## The build that kept killing my SSH session

```bash
go build ./cmd/api
```

The SSH connection died. Not an error — the connection itself dropped.

Reconnected, tried again, dropped again. Same point each time.

This is Android's low-memory killer doing exactly its job. Go builds packages in parallel, one compiler process per available core, and the M30s has eight cores. Eight concurrent `compile` processes on a device with ~3.5 GB of RAM, of which Android already owns a large slice, and something has to go. From Android's perspective, the biggest, greediest, least-important process on the device was Termux — which was hosting my PRoot, my Debian, my build *and* my SSH session. Kill Termux and all of it goes at once.

The fix is telling Go to be less ambitious:

```bash
GOMAXPROCS=2 go build -p 2 ./cmd/api
```

`-p 2` caps concurrently-compiled packages. `GOMAXPROCS=2` caps the compiler's own runtime parallelism. Together they turn eight hungry processes into two.

It took several minutes. It did not die. `ls -lh api` showed a binary.

The 10 GB swapfile from Part 1 earned its keep here — you can watch it fill during the link step. It's slow, because it's swapping to eMMC flash, but "slow" beats "killed".

Same again for the worker:

```bash
GOMAXPROCS=2 go build -p 2 ./cmd/worker
```

**The lesson I'd generalise:** on a constrained machine, the default parallelism of your build tool is a bet that you have as much memory per core as a normal server does. You don't. `-p` and `GOMAXPROCS` cost you wall-clock time and buy you a build that finishes.

---

## Port 8080 is not yours

River UI ships prebuilt ARM64 binaries, which saved me from compiling a frontend on a phone:

```bash
curl -L https://github.com/riverqueue/riverui/releases/download/v0.16.0/riverui_linux_arm64.gz \
  | gzip -d > riverui
chmod +x riverui
```

I pinned v0.16.0 to match what the project's compose file used, rather than taking `latest`.

Then a collision. My API was configured for `:8080`. So was River UI. Fine — change River UI's port.

```
$ ./riverui --help
```

There is no port flag. River UI 0.16.0 configures itself from the environment, not from CLI arguments, and the `--help` output doesn't advertise it. I went spelunking:

```bash
strings ./riverui | grep -Ei 'port|addr|listen|8080'
```

which produced a wall of generic symbol names and nothing conclusive.

The pragmatic answer: stop trying to move the thing that resists being moved. My own API had a `APP_PORT` env var I fully controlled. I moved it to `:8000` and let River UI keep `:8080`.

Final layout:

```
API        :8000
River UI   :8080
Worker     :8090   (health/metrics only)
```

Ten minutes of `strings` output to arrive at "change your own config instead." Sometimes the fix is to stop being stubborn about which component moves.

---

## tmux as an init system

Three processes that need to run indefinitely, on a machine with no systemd, reached over an SSH connection that will not stay open forever.

Running `./api &` and disconnecting doesn't work: the process is a child of your login shell, the shell dies with the connection, and everything goes with it. `nohup` gets you further but leaves you with no way to see the output afterwards.

The tool that fits is **tmux**. A tmux session is owned by the tmux server, not by your shell. Start processes inside it, detach, disconnect — they carry on. Reconnect later and attach to exactly the state you left.

For this setup tmux isn't a convenience for multiplexing panes. It is literally my process supervisor. It's what I have instead of systemd.

Which raised a design question I got wrong twice.

### The nested tmux disaster

My first attempt ran tmux *inside* Debian. It worked until I disconnected, at which point everything died anyway.

The reason: the tmux server was a process inside PRoot, PRoot was a process inside Termux, and the whole tree was still anchored to my SSH session. Detaching from the inner tmux doesn't help if the outer thing hosting it goes away.

My second attempt ran tmux in Termux *and* tmux in Debian, and I ended up with sessions inside sessions, `Ctrl+B` going to the wrong server, and no reliable idea of what was actually running. Untangling that was genuinely unpleasant over a phone terminal.

**The correct shape: one tmux session, at the Termux level, outside PRoot.** Each window enters Debian independently and runs one service.

```
Android
└── Termux
    └── tmux session "srv"          ← the supervisor
        ├── window 0: proot → Debian → ./api
        ├── window 1: proot → Debian → ./worker
        ├── window 2: proot → Debian → ./riverui
        └── window 3: proot → Debian → cloudflared
```

Four independent PRoot instances is not free. But each service is isolated — one crashing doesn't take the others with it — and the tmux server sits above the layer that dies when SSH drops.

---

## Getting it on the internet

Now the part I'd actually been curious about: could this phone serve public HTTPS traffic?

The obvious approach — port forwarding on the router — was unappealing. Residential CGNAT, no static IP, and it means opening ports on my home network to reach a phone. Hard no.

**Cloudflare Tunnel** solves this properly, and it's the piece of this whole project I'd recommend to anyone regardless of whether they own a rooted phone. The tunnel daemon makes an *outbound* connection to Cloudflare and holds it open. Traffic to your hostname arrives at Cloudflare's edge and comes back down that existing connection. No inbound ports. No port forwarding. No static IP. Nothing listening on your router.

Setup:

1. Point the domain's nameservers at Cloudflare.
2. Dashboard → Networking → Tunnels → Create Tunnel. Copy the token.
3. Add published applications on that tunnel:

```
api.sgagan.dev    →  http://localhost:8000
river.sgagan.dev  →  http://localhost:8080
```

One tunnel, multiple hostname → service mappings. Cloudflare creates the DNS records for you.

4. Install `cloudflared` for ARM64 inside Debian and run it with the token.

The first time I hit `https://api.sgagan.dev` and got a JSON response from a Go process running on a phone on my desk, routed through Cloudflare's global network, with no ports open anywhere — that was the moment the whole thing felt worth it.

### Error 1033

Cloudflare's 1033 means "the tunnel isn't connected." Which is unhelpfully broad: it covers a dead `cloudflared`, a bad token, and a fine tunnel pointing at a service that isn't listening.

Mine was a token problem, and it was self-inflicted. The token lived in `.env`, and my launcher sourced `.env` in a way that didn't reach the `cloudflared` window. So `cloudflared` started with an empty token and failed with `Invalid tunnel secret` — a message I couldn't see, because it was scrolling past in a tmux window I wasn't attached to.

Debugging discipline that saved me here: always test the local service before blaming the tunnel.

```bash
curl -I http://localhost:8000      # is the service up?
curl -I https://api.sgagan.dev   # is the tunnel up?
```

If the first works and the second doesn't, it's the tunnel. If neither works, stop looking at Cloudflare.

---

## Tailscale, and the PRoot lie coming due

For administration I wanted to reach the phone by name from anywhere, without caring what IP my router had handed it that week.

Tailscale is the obvious choice. I installed it inside Debian, ran `tailscale up`, and got:

```
tun module not loaded nor found on disk
tstun.New("tailscale0") error: permission denied
```

Even though `/dev/net/tun` existed and was readable.

The logs also cheerfully reported:

```
Linux kernel version: 6.17.0-PRoot-Distro
```

Which, as noted in Part 1, is PRoot lying. There is no 6.17 kernel. There's a Samsung 4.14 kernel, and a ptrace-based syscall rewriter presenting a friendlier version number to software that would otherwise complain.

That lie is exactly what went wrong here. Tailscale needs to *create and configure a network interface* — a genuine kernel operation. PRoot can rewrite the paths in a syscall. It cannot grant a capability the kernel won't give the calling process. A container gets `CAP_NET_ADMIN` from the kernel; PRoot has nothing to hand out.

**The fix was to stop asking the wrong layer.** The phone is rooted. Android can create a TUN interface. So I installed the Tailscale *Android app*, outside PRoot entirely:

```
                Tailscale mesh
   Mac ────────────────────────────── M30s (Android app)
                                        │
                                   Termux sshd :8022
                                        │
                                     PRoot Debian
                                        │
                                      astraxx
```

Tailscale handles the network layer at the Android level; everything above it just uses the network. Immediately:

```
$ tailscale ping 100.x.x.x
pong from galaxy-m30s (100.x.x.x) via 192.168.0.5:55727 in 255ms

$ ssh -p 8022 astraxx@galaxy-m30s
```

With MagicDNS, the phone is `galaxy-m30s` from any of my devices, on any network, forever.

The general principle, which cost me an evening: **in a layered environment, do each job at the layer that actually has the privileges for it.** Networking belongs to the kernel, so it belongs to Android. Userspace belongs to Debian.

---

## The launcher

Everything assembled into one Termux script, `~/bin/srv`:

```bash
#!/data/data/com.termux/files/usr/bin/bash
set -e

SESSION="srv"
APP_DIR="/home/astraxx/app"

if tmux has-session -t "$SESSION" 2>/dev/null; then
    echo "Already running. Attach with: tmux attach -t $SESSION"
    exit 0
fi

echo "Starting..."

# API :8000
tmux new-session -d -s "$SESSION" -n api
tmux send-keys -t "$SESSION:api" \
    "proot-distro login debian -- bash -lc 'cd $APP_DIR && set -a && source .env && set +a && ./api'" C-m

# Worker :8090
tmux new-window -t "$SESSION" -n worker
tmux send-keys -t "$SESSION:worker" \
    "proot-distro login debian -- bash -lc 'cd $APP_DIR && set -a && source .env && set +a && ./worker'" C-m

# River UI :8080
tmux new-window -t "$SESSION" -n riverui
tmux send-keys -t "$SESSION:riverui" \
    "proot-distro login debian -- bash -lc 'cd $APP_DIR && set -a && source .env && set +a && ./riverui'" C-m

# Cloudflare Tunnel
tmux new-window -t "$SESSION" -n cloudflare
tmux send-keys -t "$SESSION:cloudflare" \
    "proot-distro login debian -- bash -lc 'cd $APP_DIR && set -a && source .env && set +a && cloudflared tunnel run --token \"\$CLOUDFLARE_TUNNEL_TOKEN\"'" C-m

echo "  API        :8000"
echo "  Worker     :8090"
echo "  River UI   :8080"
echo "  Attach:    tmux attach -t $SESSION"
```

The `set -a && source .env && set +a` pattern is the important detail. `set -a` marks every subsequently-assigned variable for export, so sourcing `.env` puts all of it in the environment rather than in local shell variables. Without it, `cloudflared` never sees its token — which is precisely the 1033 above.

Workflow is now:

```bash
ssh -p 8022 astraxx@galaxy-m30s
srv
# Ctrl+B D to detach
exit
```

Services keep running. `tmux attach -t srv` to check on them, `Ctrl+B 0/1/2/3` to move between windows.

---

## Two things Android will do to you

**Battery optimisation will kill Termux.** Android has no concept of "this app is a server." As far as it's concerned Termux is a backgrounded app consuming resources, and it will be terminated eventually. You need:

- `termux-wake-lock` to hold a partial wake lock
- Termux explicitly excluded from battery optimisation in Android settings
- On Samsung specifically, Termux added to "Never sleeping apps" in Device Care — Samsung's power management is more aggressive than stock Android and ignores the standard exclusion in some cases

**Nothing survives a reboot.** No systemd means no enabled services. After a restart you re-`swapon` the swapfile as root and re-run `srv`. I've left it that way — it reboots rarely, and it's plugged in permanently.

---

## The last bug

Everything was in place. `srv` did nothing. No error, no services, no tmux session. Just an immediate return to the prompt.

```bash
$ bash -x ~/bin/srv
++ bash
```

That's the entire trace.

I had pasted the script into `nano` **including the Markdown code fence**. The first line of my executable shell script was:

```
```bash
```

Backticks are command substitution. The shell dutifully executed the command `bash` inside them, got a new shell, that shell read EOF from a non-terminal and exited, and the script had nothing left to do.

The fix:

```bash
sed -i '1{/^```bash$/d;}' ~/bin/srv
sed -i '/^```$/d' ~/bin/srv
```

Three days of bootloader unlocking, kernel config archaeology, OOM-killed builds and tunnel debugging, and the final boss was copy-paste.

Then:

```
======================================
        services started
======================================

  API:        :8000
  Worker:     :8090
  River UI:   :8080
  Cloudflare: phone-tunnel
```

---

## The final architecture

```
                 Internet
                    │
              Cloudflare edge
                    │  outbound tunnel only
                    ▼
        ┌───────────────────────┐
        │   Galaxy M30s         │
        │   Android 11, rooted  │
        │                       │
        │   Termux              │
        │   └── tmux "srv"      │
        │       ├── API   :8000 │
        │       ├── Wrkr  :8090 │
        │       ├── River :8080 │
        │       └── cloudflared │
        │            (each in   │
        │         PRoot Debian) │
        └───────────┬───────────┘
                    │
              Neon Postgres
```

Public:

```
api.sgagan.dev     → API
river.sgagan.dev   → River UI (basic auth)
```

Private, over Tailscale:

```
ssh -p 8022 astraxx@galaxy-m30s
```

Zero inbound ports on my router. Zero monthly cost beyond electricity and free tiers.

---

## What I'd do differently

**Cross-compile.** Building on the phone was a good exercise in constrained-machine debugging, and I don't regret doing it once. But `GOOS=linux GOARCH=arm64 go build` on a laptop takes seconds and `scp` moves the binary in seconds more. There's no reason to keep compiling on the target.

**A proper supervisor.** tmux works but it doesn't restart anything. If the API panics at 3am, it stays dead. Something small like `runit` or a supervision loop in the launcher would be a real improvement, though supervisors without systemd underneath is its own rabbit hole.

**Persist the swapfile.** A Magisk boot script would re-`swapon` automatically. I keep meaning to.

---

## Was it worth it?

The E2.1.Micro I'd started with is still sitting in Oracle's console, unused.

But the point stopped being the free server pretty early on. Docker being impossible was the best thing that happened to this project, because it forced me to build by hand every layer that Docker would have handed me — process supervision, environment loading, port allocation, service networking, ingress — and to find out which kernel features each of those actually rests on.

I've deployed a lot of containers. I understood containers considerably better after failing to run one.

There is also something genuinely nice about a server with a battery, a screen, and a camera, that costs nothing to run and lives in the corner of a desk quietly serving HTTPS.

The phone is still up.

---

*[Part 1](/posts/rooting-a-dead-phone-into-a-server) covers the bootloader unlock, the Magisk root, and the kernel config that made all of this necessary.*
