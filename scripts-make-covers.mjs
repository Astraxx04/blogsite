// Generates the cover images for the two phone-server posts.
//   node scripts-make-covers.mjs
// Re-run after editing; it overwrites public/assets/blog/<slug>/cover.png.
//
// 1200x630 is the OG card size. The post header renders the cover in an
// aspect-[16/9] box with object-cover, so the left and right ~6% get cropped
// there — keep anything that matters inside the 70px side margins.
//
// Deliberately NOT the site palette. The blog is dark violet; these are warm
// paper with ink line-work, so a cover reads as an object on a page rather than
// as a screenshot of the site it links to. The only dark area is the phone's
// screen, which is the point of both images.
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';

const W = 1200;
const H = 630;

// Paper
const BG = '#f2efe5';
const PAPER = '#fbfaf5';
const INK = '#1c1b18';
const MUTED = '#55514a';
const SUBTLE = '#8c8579';
const RULE = 'rgba(28,27,24,0.18)';
const ACCENT = '#c2410c';

// Screen (the one lit surface)
const SCREEN = '#141317';
const S_FG = '#eae7e1';
const S_DIM = '#8b8680';
const S_ACCENT = '#fb923c';
const S_OK = '#4ade80';

const SANS = 'Helvetica Neue, Helvetica, Arial, sans-serif';
const MONO = 'Menlo, DejaVu Sans Mono, monospace';

const esc = (s) =>
    s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Outlined pill for the spec callouts beside the phone. */
const chip = (x, y, label) => `
  <rect x="${x}" y="${y}" width="${18 + label.length * 8.6}" height="30" rx="4"
        fill="none" stroke="${RULE}" stroke-width="1"/>
  <text x="${x + 14}" y="${y + 20}" font-family="${MONO}" font-size="13" fill="${MUTED}">${esc(label)}</text>`;

const phoneCover = ({ eyebrow, title, sub, screen, chips, bar }) => {
    // Kept well inside the right margin: the header crops this to 16:9, taking
    // roughly 6% off each side, and the rotation pushes corners out further.
    const PX = 748;
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
    <pattern id="grid" width="26" height="26" patternUnits="userSpaceOnUse">
      <path d="M 26 0 L 0 0 0 26" fill="none"
            stroke="rgba(28,27,24,0.055)" stroke-width="1"/>
    </pattern>
    <pattern id="grid5" width="130" height="130" patternUnits="userSpaceOnUse">
      <path d="M 130 0 L 0 0 0 130" fill="none"
            stroke="rgba(28,27,24,0.09)" stroke-width="1"/>
    </pattern>
  </defs>

  <rect width="${W}" height="${H}" fill="${BG}"/>
  <rect width="${W}" height="${H}" fill="url(#grid)"/>
  <rect width="${W}" height="${H}" fill="url(#grid5)"/>
  <!-- drawing frame -->
  <rect x="34" y="34" width="${W - 68}" height="${H - 68}" rx="2"
        fill="none" stroke="${RULE}" stroke-width="1"/>

  <text x="70" y="112" font-family="${SANS}" font-size="16" font-weight="700"
        letter-spacing="3.4" fill="${ACCENT}">${esc(eyebrow)}</text>
  <rect x="70" y="126" width="46" height="3" fill="${ACCENT}"/>

  ${title
      .map(
          (l, i) =>
              `<text x="70" y="${202 + i * 60}" font-family="${SANS}" font-size="50" font-weight="700" letter-spacing="-1.4" fill="${INK}">${esc(l)}</text>`
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
          fill="none" stroke="${INK}" stroke-opacity="0.34" stroke-width="5" stroke-linecap="round"/>

    <!-- body drawn as line-work, not a solid slab -->
    <rect x="${PX}" y="${PY}" width="${PW}" height="${PH}" rx="30"
          fill="${PAPER}" stroke="${INK}" stroke-width="2.2"/>
    <rect x="${PX + 7}" y="${PY + 7}" width="${PW - 14}" height="${PH - 14}" rx="24"
          fill="none" stroke="${RULE}" stroke-width="1"/>

    <!-- earpiece + front camera -->
    <rect x="${cx - 26}" y="${PY + 26}" width="52" height="5" rx="2.5"
          fill="none" stroke="${INK}" stroke-opacity="0.45" stroke-width="1.5"/>
    <circle cx="${cx + 44}" cy="${PY + 28}" r="4.5"
            fill="none" stroke="${INK}" stroke-opacity="0.45" stroke-width="1.5"/>

    <!-- screen: the only lit surface on the page -->
    <rect x="${sx}" y="${sy}" width="${sw}" height="${sh}" rx="8" fill="${SCREEN}"/>
    <rect x="${sx}" y="${sy}" width="${sw}" height="26" rx="8" fill="#1f1e24"/>
    <rect x="${sx}" y="${sy + 16}" width="${sw}" height="10" fill="#1f1e24"/>
    <circle cx="${sx + 14}" cy="${sy + 13}" r="3.5" fill="${S_OK}"/>
    <text x="${sx + 26}" y="${sy + 18}" font-family="${MONO}" font-size="11" fill="${S_DIM}">${esc(bar)}</text>

    ${screen
        .map((l, i) => {
            const fill =
                l.tone === 'cmd' ? S_FG : l.tone === 'off' ? S_DIM : S_ACCENT;
            const y = sy + 46 + i * 22;
            // A dot marks a process that is actually up; text shifts right of it.
            const dot = l.dot
                ? `<circle cx="${sx + 17}" cy="${y - 4}" r="3.5" fill="${S_OK}"/>`
                : '';
            const tx = l.dot ? sx + 28 : sx + 12;
            return `${dot}<text x="${tx}" y="${y}" font-family="${MONO}" font-size="12" font-weight="${l.tone === 'cmd' ? 600 : 400}" fill="${fill}" xml:space="preserve">${esc(l.t)}</text>`;
        })
        .join('\n    ')}

    ${screen.at(-1)?.cursor === false ? '' : `<rect x="${sx + 12}" y="${sy + 46 + screen.length * 22 - 9}" width="7" height="13" fill="${S_ACCENT}"/>`}
  </g>
</svg>`;
};

const POSTS = [
    {
        slug: 'rooting-a-dead-phone-into-a-server',
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
    await sharp(Buffer.from(phoneCover(p))).png().toFile(`${dir}/cover.png`);
    console.log(`wrote ${dir}/cover.png`);
}
