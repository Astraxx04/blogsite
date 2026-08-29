// Generates the cover images for the two phone-server posts.
//   node scripts-make-covers.mjs
// Re-run after editing; it overwrites public/assets/blog/<slug>/cover.png.
//
// 1200x630 is the OG card size. The post header renders the cover in an
// aspect-[16/9] box with object-cover, so the left and right ~6% get cropped
// there — keep anything that matters inside the 70px side margins.
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';

const W = 1200;
const H = 630;

// Site tokens, dark theme (src/app/globals.css) + the brand gradient used on
// blockquote borders and list markers.
const BG = '#121212';
const PANEL = '#17171b';
const LINE = 'rgba(255,255,255,0.10)';
const FG = '#f1f0f3';
const MUTED = '#bdb9c4';
const SUBTLE = '#7e7a89';
const PINK = '#aa367c';
const PURPLE = '#4a2fbd';

const SANS = 'Helvetica Neue, Helvetica, Arial, sans-serif';
const MONO = 'Menlo, DejaVu Sans Mono, monospace';

const esc = (s) =>
    s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** One line of terminal output, coloured by role. */
const term = (lines, x, y, step = 30) =>
    lines
        .map((l, i) => {
            const fill =
                l.tone === 'cmd' ? FG : l.tone === 'off' ? SUBTLE : PINK;
            const weight = l.tone === 'cmd' ? 600 : 400;
            return `<text x="${x}" y="${y + i * step}" font-family="${MONO}" font-size="19" font-weight="${weight}" fill="${fill}" xml:space="preserve">${esc(l.t)}</text>`;
        })
        .join('\n');

const cover = ({ eyebrow, title, sub, lines, prompt }) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <linearGradient id="brand" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${PINK}"/>
      <stop offset="100%" stop-color="${PURPLE}"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.78" cy="0.28" r="0.62">
      <stop offset="0%" stop-color="${PURPLE}" stop-opacity="0.30"/>
      <stop offset="100%" stop-color="${PURPLE}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glow2" cx="0.12" cy="0.88" r="0.55">
      <stop offset="0%" stop-color="${PINK}" stop-opacity="0.20"/>
      <stop offset="100%" stop-color="${PINK}" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="${W}" height="${H}" fill="${BG}"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>
  <rect width="${W}" height="${H}" fill="url(#glow2)"/>

  <!-- Left column: label, title, standfirst -->
  <rect x="70" y="112" width="52" height="4" rx="2" fill="url(#brand)"/>
  <text x="70" y="98" font-family="${SANS}" font-size="17" font-weight="700"
        letter-spacing="3.2" fill="${PINK}">${esc(eyebrow)}</text>

  ${title
      .map(
          (l, i) =>
              `<text x="70" y="${186 + i * 62}" font-family="${SANS}" font-size="53" font-weight="700" letter-spacing="-1.4" fill="${FG}">${esc(l)}</text>`
      )
      .join('\n  ')}

  ${sub
      .map(
          (l, i) =>
              `<text x="70" y="${196 + title.length * 62 + i * 30}" font-family="${SANS}" font-size="21" fill="${MUTED}">${esc(l)}</text>`
      )
      .join('\n  ')}

  <!-- Terminal card -->
  <rect x="70" y="${H - 262}" width="${W - 140}" height="200" rx="14"
        fill="${PANEL}" stroke="${LINE}" stroke-width="1"/>
  <circle cx="100" cy="${H - 234}" r="5.5" fill="#5a5560"/>
  <circle cx="120" cy="${H - 234}" r="5.5" fill="#5a5560"/>
  <circle cx="140" cy="${H - 234}" r="5.5" fill="#5a5560"/>
  <text x="164" y="${H - 229}" font-family="${MONO}" font-size="14" fill="${SUBTLE}">${esc(prompt)}</text>
  <line x1="70" y1="${H - 214}" x2="${W - 70}" y2="${H - 214}" stroke="${LINE}" stroke-width="1"/>
  ${term(lines, 100, H - 180)}
</svg>`;

/** Small outlined pill, used for the spec callouts beside the phone. */
const chip = (x, y, label) => `
  <rect x="${x}" y="${y}" width="${18 + label.length * 8.6}" height="30" rx="15"
        fill="none" stroke="${LINE}" stroke-width="1"/>
  <text x="${x + 14}" y="${y + 20}" font-family="${MONO}" font-size="13" fill="${SUBTLE}">${esc(label)}</text>`;

/* Cover 1: the phone is the subject. Screen carries the grep result, so there
   is no separate terminal card. Body is rotated a few degrees so it reads as an
   object on a desk rather than a UI mockup. */
const phoneCover = ({ eyebrow, title, sub, screen, chips, bar }) => {
    // Kept well inside the right margin: the header crops this to 16:9, taking
    // roughly 6% off each side, and the rotation pushes corners out further.
    const PX = 748; // phone body, before rotation
    const PY = 92;
    const PW = 240;
    const PH = 446;
    const cx = PX + PW / 2;
    const cy = PY + PH / 2;
    const sx = PX + 15;
    const sy = PY + 48;
    const sw = PW - 30;
    const sh = PH - 82;

    return `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <linearGradient id="brand" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${PINK}"/>
      <stop offset="100%" stop-color="${PURPLE}"/>
    </linearGradient>
    <linearGradient id="edge" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#3a3a44"/>
      <stop offset="50%" stop-color="#26262e"/>
      <stop offset="100%" stop-color="#3a3a44"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.74" cy="0.34" r="0.60">
      <stop offset="0%" stop-color="${PURPLE}" stop-opacity="0.38"/>
      <stop offset="100%" stop-color="${PURPLE}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glow2" cx="0.10" cy="0.90" r="0.55">
      <stop offset="0%" stop-color="${PINK}" stop-opacity="0.20"/>
      <stop offset="100%" stop-color="${PINK}" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="${W}" height="${H}" fill="${BG}"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>
  <rect width="${W}" height="${H}" fill="url(#glow2)"/>

  <rect x="70" y="126" width="52" height="4" rx="2" fill="url(#brand)"/>
  <text x="70" y="112" font-family="${SANS}" font-size="17" font-weight="700"
        letter-spacing="3.2" fill="${PINK}">${esc(eyebrow)}</text>

  ${title
      .map(
          (l, i) =>
              `<text x="70" y="${202 + i * 60}" font-family="${SANS}" font-size="50" font-weight="700" letter-spacing="-1.4" fill="${FG}">${esc(l)}</text>`
      )
      .join('\n  ')}

  ${sub
      .map(
          (l, i) =>
              `<text x="70" y="${214 + title.length * 60 + i * 29}" font-family="${SANS}" font-size="20" fill="${MUTED}">${esc(l)}</text>`
      )
      .join('\n  ')}

  ${chips.map((c, i) => chip(70, 452 + i * 42, c)).join('\n  ')}

  <g transform="rotate(-5 ${cx} ${cy})">
    <!-- power cable: it lives plugged in -->
    <path d="M ${cx} ${PY + PH + 6} C ${cx} ${PY + PH + 70}, ${cx - 150} ${PY + PH + 40}, ${cx - 230} ${PY + PH + 96}"
          fill="none" stroke="#2e2e36" stroke-width="7" stroke-linecap="round"/>

    <rect x="${PX}" y="${PY}" width="${PW}" height="${PH}" rx="30"
          fill="url(#edge)" stroke="rgba(255,255,255,0.14)" stroke-width="1.5"/>
    <rect x="${PX + 6}" y="${PY + 6}" width="${PW - 12}" height="${PH - 12}" rx="25"
          fill="#0d0d10"/>

    <!-- earpiece + front camera -->
    <rect x="${cx - 26}" y="${PY + 26}" width="52" height="5" rx="2.5" fill="#26262e"/>
    <circle cx="${cx + 44}" cy="${PY + 28}" r="4.5" fill="#1b1b22"/>

    <!-- screen -->
    <rect x="${sx}" y="${sy}" width="${sw}" height="${sh}" rx="10" fill="${PANEL}"/>
    <rect x="${sx}" y="${sy}" width="${sw}" height="26" rx="10" fill="#1e1e24"/>
    <rect x="${sx}" y="${sy + 16}" width="${sw}" height="10" fill="#1e1e24"/>
    <circle cx="${sx + 14}" cy="${sy + 13}" r="3.5" fill="#3f9c58"/>
    <text x="${sx + 26}" y="${sy + 18}" font-family="${MONO}" font-size="11" fill="${SUBTLE}">${esc(bar)}</text>

    ${screen
        .map((l, i) => {
            const fill =
                l.tone === 'cmd' ? FG : l.tone === 'off' ? '#6f6b7a' : PINK;
            const y = sy + 46 + i * 22;
            // A dot marks a process that is actually up; text shifts right of it.
            const dot = l.dot
                ? `<circle cx="${sx + 17}" cy="${y - 4}" r="3.5" fill="#3f9c58"/>`
                : '';
            const tx = l.dot ? sx + 28 : sx + 12;
            return `${dot}<text x="${tx}" y="${y}" font-family="${MONO}" font-size="12" font-weight="${l.tone === 'cmd' ? 600 : 400}" fill="${fill}" xml:space="preserve">${esc(l.t)}</text>`;
        })
        .join('\n    ')}

    ${screen.at(-1)?.cursor === false ? '' : `<rect x="${sx + 12}" y="${sy + 46 + screen.length * 22 - 9}" width="7" height="13" fill="${PINK}"/>`}
  </g>
</svg>`;
};

const POSTS = [
    {
        slug: 'rooting-a-dead-phone-into-a-server',
        kind: 'phone',
        eyebrow: 'PART 1 OF 2',
        title: ['Turning a Dead Phone', 'Into a Linux Server'],
        sub: ['Bootloader unlocking, Magisk, and the', 'kernel config that killed Docker.'],
        chips: ['Exynos 9611 - 8 cores', '4 GB RAM - no SIM'],
        bar: 'root@m30s',
        screen: [
            { t: '$ zcat /proc/config.gz', tone: 'cmd' },
            { t: '# USER_NS   not set', tone: 'off' },
            { t: '# VETH      not set', tone: 'off' },
            { t: '# BRIDGE    not set', tone: 'off' },
            { t: '# OVERLAY_FS not set', tone: 'off' },
            { t: '', tone: 'out' },
            { t: 'docker: no.', tone: 'out' },
            { t: '', tone: 'out' },
            { t: '$ proot-distro login', tone: 'cmd' },
            { t: 'debian bookworm', tone: 'off' },
        ],
    },
    {
        kind: 'phone',
        slug: 'running-a-go-service-on-a-phone',
        eyebrow: 'PART 2 OF 2',
        title: ['Running a Real Go', 'Service on a Phone'],
        sub: ['OOM-killed builds, tmux as an init system,', 'and public HTTPS with no open ports.'],
        chips: ['tmux instead of systemd', 'zero inbound ports'],
        // Device-level status, not a tmux window list: tailscale runs as the
        // Android app, outside PRoot, which is the whole point of that section.
        bar: 'galaxy-m30s',
        screen: [
            { t: 'api          :8000', tone: 'out', dot: true },
            { t: 'worker       :8090', tone: 'out', dot: true },
            { t: 'riverui      :8080', tone: 'out', dot: true },
            { t: 'cloudflared  tunnel', tone: 'out', dot: true },
            { t: 'tailscale    mesh', tone: 'out', dot: true },
            { t: '', tone: 'out' },
            { t: 'xxx.sgagan.dev', tone: 'cmd' },
            { t: '200 OK', tone: 'off', cursor: false },
        ],
    },
];

for (const p of POSTS) {
    const dir = `public/assets/blog/${p.slug}`;
    await mkdir(dir, { recursive: true });
    const svg = phoneCover(p);
    await sharp(Buffer.from(svg)).png().toFile(`${dir}/cover.png`);
    console.log(`wrote ${dir}/cover.png`);
}
