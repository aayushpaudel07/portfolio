"use client";

import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { motion } from "framer-motion";
import { TerminalSquare } from "lucide-react";
import SectionHeading from "./SectionHeading";
import {
  achievements,
  certifications,
  education,
  profile,
  projects,
  skillCategories,
  tools,
} from "@/lib/data";

/* ---------------------------------- types --------------------------------- */

type Line = { type: "input"; text: string; prompt: string } | { type: "output"; text: string };

type FSNode =
  | { type: "dir"; children: Record<string, FSNode>; restricted?: boolean }
  | { type: "file"; content: string; restricted?: boolean };

type Ctx = {
  print: (l: string | string[]) => void;
  clear: () => void;
  getCwd: () => string;
  setCwd: (p: string) => void;
  fs: FSNode;
  history: string[];
  bootTime: number;
};

type Handler = (args: string[], ctx: Ctx) => void | Promise<void>;

/* ------------------------------- fs helpers ------------------------------- */

const HOME = "/home/guest";

function wrap(text: string, width = 62): string {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    if ((cur + " " + w).trim().length > width) {
      lines.push(cur.trim());
      cur = w;
    } else {
      cur += " " + w;
    }
  }
  if (cur.trim()) lines.push(cur.trim());
  return lines.join("\n");
}

function file(content: string, restricted = false): FSNode {
  return { type: "file", content, restricted };
}

function dir(children: Record<string, FSNode>, restricted = false): FSNode {
  return { type: "dir", children, restricted };
}

const COMMAND_NAMES = [
  "help", "ls", "cd", "pwd", "cat", "tree", "echo", "mkdir", "touch", "rm",
  "whoami", "id", "hostname", "uname", "date", "uptime", "ps", "free", "df",
  "ifconfig", "ping", "nmap", "which", "man", "history", "neofetch", "sudo",
  "clear", "exit", "about", "skills", "education", "projects",
  "certifications", "achievements", "contact", "resume", "banner",
];

function buildFS(): FSNode {
  const projectFiles: Record<string, FSNode> = {};
  for (const p of projects) {
    projectFiles[`${p.id}.md`] = file(
      `# ${p.title}\n\n${wrap(p.description)}\n\nTags: ${p.categories.join(", ")}\nSource: ${p.github ?? "coming soon"}`
    );
  }

  const certFiles: Record<string, FSNode> = {};
  for (const c of certifications) {
    certFiles[`${c.id}.cert`] = file(
      `CERTIFICATE\n  issuer : ${c.issuer}\n  name   : ${c.name}\n  status : verified`
    );
  }

  return dir({
    bin: dir(Object.fromEntries(COMMAND_NAMES.map((c) => [c, file("ELF 64-bit executable")]))),
    etc: dir({
      hostname: file("error-found"),
      "os-release": file(
        'PRETTY_NAME="Kali GNU/Linux Rolling"\nNAME="Kali GNU/Linux"\nID=kali\nID_LIKE=debian'
      ),
      passwd: file(
        "root:x:0:0:root:/root:/usr/bin/zsh\nguest:x:1001:1001:guest:/home/guest:/bin/bash\naayush:x:1000:1000:Aayush Paudel:/home/aayush:/usr/bin/zsh"
      ),
      shadow: file("", true),
    }),
    var: dir({
      log: dir({
        "auth.log": file(
          "Jul  6 09:14:02 error-found sudo: guest : user NOT in sudoers ; TTY=pts/0 ; COMMAND=/usr/bin/cat /etc/shadow\nJul  6 09:14:41 error-found sudo: guest : 3 incorrect password attempts\nJul  6 09:15:03 error-found sshd[1337]: Failed password for root from 10.0.2.99 port 51337 ssh2"
        ),
      }),
    }),
    root: dir({}, true),
    home: dir({
      guest: dir({
        "about.txt": file(wrap(profile.bio)),
        "skills.txt": file(
          skillCategories
            .map((c) => `[${c.label}]\n${c.skills.map((s) => `  - ${s}`).join("\n")}`)
            .join("\n\n") + `\n\n[Tools]\n${tools.map((t) => `  - ${t}`).join("\n")}`
        ),
        "education.txt": file(
          education
            .map(
              (e) =>
                `${e.institution}\n${e.degree}\nStatus: ${e.period}\n\nCoursework:\n${e.coursework
                  .map((c) => `  - ${c}`)
                  .join("\n")}`
            )
            .join("\n\n")
        ),
        "contact.txt": file(
          `email    : ${profile.email}\nphone    : ${profile.phone}\nlocation : ${profile.location}\ngithub   : ${profile.github}\nlinkedin : ${profile.linkedin}`
        ),
        "achievements.log": file(
          achievements.map((a, i) => `[2025-0${(i % 9) + 1}-1${i} 10:${10 + i * 7}] ${a.title}`).join("\n")
        ),
        "resume.pdf": file("%PDF-1.4 (binary) — run 'resume' to download the real thing"),
        ".bash_history": file(
          "nmap -sV -sC 10.10.11.42\nsudo apt update && sudo apt full-upgrade -y\nmsfconsole -q\nhydra -l admin -P rockyou.txt ssh://10.10.11.42\ncat /etc/shadow\nsudo !!"
        ),
        ".secret": dir({
          "flag.txt": file("flag{err0r_f0und_but_n0t_by_r3cruit3rs}\n\nNice work. You actually looked. 🏴"),
        }),
        projects: dir(projectFiles),
        certifications: dir(certFiles),
      }),
    }),
  });
}

function resolvePath(cwd: string, target?: string): string {
  let t = target === undefined || target === "" ? "~" : target;
  if (t === "~" || t.startsWith("~/")) t = HOME + t.slice(1);
  const stack = t.startsWith("/") ? [] : cwd.split("/").filter(Boolean);
  for (const part of t.split("/").filter(Boolean)) {
    if (part === ".") continue;
    else if (part === "..") stack.pop();
    else stack.push(part);
  }
  return "/" + stack.join("/");
}

function getNode(fs: FSNode, path: string): FSNode | null {
  if (path === "/") return fs;
  let node: FSNode = fs;
  for (const part of path.split("/").filter(Boolean)) {
    if (node.type !== "dir") return null;
    const next: FSNode | undefined = node.children[part];
    if (!next) return null;
    node = next;
  }
  return node;
}

function displayPath(path: string): string {
  return path === HOME ? "~" : path.startsWith(HOME + "/") ? "~" + path.slice(HOME.length) : path;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function fakeIp(host: string): string {
  let h = 0;
  for (const c of host) h = (h * 31 + c.charCodeAt(0)) % 200;
  return `104.21.${(h % 200) + 10}.${((h * 7) % 200) + 10}`;
}

/* -------------------------------- commands -------------------------------- */

const BANNER = [
  "┌─[ error_found v2.0 — virtual shell ]───────┐",
  "│  user  : guest                             │",
  "│  host  : error-found (Kali GNU/Linux)      │",
  "│  note  : real commands. try 'neofetch'     │",
  "└────────────────────────────────────────────┘",
  "Type 'help' for commands · Tab completes · ↑ recalls history.",
];

const NEOFETCH_LOGO = [
  "  ┌───────────────┐ ",
  "  │  >_           │ ",
  "  │               │ ",
  "  │  error_found  │ ",
  "  └───────────────┘ ",
  "                    ",
  "                    ",
  "                    ",
];

function makeHandlers(download: () => void): Record<string, Handler> {
  const handlers: Record<string, Handler> = {
    help: (_a, ctx) =>
      ctx.print([
        "GNU bash-alike, error_found edition. Available commands:",
        "",
        "  Linux:",
        "    ls  cd  pwd  cat  tree  echo  mkdir  touch  rm  whoami  id",
        "    hostname  uname  date  uptime  ps  free  df  ifconfig  ping",
        "    nmap  which  man  history  neofetch  sudo  clear  exit",
        "",
        "  Portfolio:",
        "    about  skills  education  projects  certifications",
        "    achievements  contact  resume  banner",
        "",
        "  Tips: Tab = autocomplete · ↑/↓ = history · hidden files exist.",
      ]),

    pwd: (_a, ctx) => ctx.print(ctx.getCwd()),

    ls: (args, ctx) => {
      const flags = args.filter((a) => a.startsWith("-")).join("");
      const showAll = flags.includes("a");
      const long = flags.includes("l");
      const target = args.find((a) => !a.startsWith("-"));
      const path = resolvePath(ctx.getCwd(), target ?? ".");
      const node = getNode(ctx.fs, path);
      if (!node) return ctx.print(`ls: cannot access '${target ?? path}': No such file or directory`);
      if (node.restricted) return ctx.print(`ls: cannot open directory '${displayPath(path)}': Permission denied`);
      if (node.type === "file") return ctx.print(target ?? path);
      const names = Object.keys(node.children)
        .filter((n) => showAll || !n.startsWith("."))
        .sort();
      if (long) {
        ctx.print(`total ${names.length}`);
        for (const n of names) {
          const child = node.children[n];
          const isDir = child.type === "dir";
          const perms = child.restricted ? (isDir ? "drwx------" : "-r--------") : isDir ? "drwxr-xr-x" : "-rw-r--r--";
          const size = child.type === "file" ? child.content.length : 4096;
          ctx.print(`${perms}  1 guest guest ${String(size).padStart(6)} Jul  6 21:00 ${n}${isDir ? "/" : ""}`);
        }
      } else {
        ctx.print(names.map((n) => (node.children[n].type === "dir" ? n + "/" : n)).join("  ") || "");
      }
    },

    cd: (args, ctx) => {
      const path = resolvePath(ctx.getCwd(), args[0]);
      const node = getNode(ctx.fs, path);
      if (!node) return ctx.print(`bash: cd: ${args[0]}: No such file or directory`);
      if (node.type !== "dir") return ctx.print(`bash: cd: ${args[0]}: Not a directory`);
      if (node.restricted) return ctx.print(`bash: cd: ${args[0]}: Permission denied`);
      ctx.setCwd(path);
    },

    cat: (args, ctx) => {
      if (args.length === 0) return ctx.print("cat: missing operand");
      for (const arg of args) {
        const path = resolvePath(ctx.getCwd(), arg);
        const node = getNode(ctx.fs, path);
        if (!node) ctx.print(`cat: ${arg}: No such file or directory`);
        else if (node.type === "dir") ctx.print(`cat: ${arg}: Is a directory`);
        else if (node.restricted) ctx.print(`cat: ${arg}: Permission denied`);
        else ctx.print(node.content.split("\n"));
      }
    },

    tree: (args, ctx) => {
      const path = resolvePath(ctx.getCwd(), args[0] ?? ".");
      const node = getNode(ctx.fs, path);
      if (!node || node.type !== "dir") return ctx.print(`tree: '${args[0] ?? path}': No such directory`);
      if (node.restricted) return ctx.print(`tree: '${displayPath(path)}': Permission denied`);
      const out: string[] = [displayPath(path)];
      const walk = (d: FSNode & { type: "dir" }, prefix: string) => {
        const names = Object.keys(d.children).filter((n) => !n.startsWith(".")).sort();
        names.forEach((n, i) => {
          const last = i === names.length - 1;
          const child = d.children[n];
          out.push(`${prefix}${last ? "└── " : "├── "}${n}${child.type === "dir" ? "/" : ""}`);
          if (child.type === "dir" && !child.restricted) walk(child, prefix + (last ? "    " : "│   "));
        });
      };
      walk(node, "");
      ctx.print(out);
    },

    echo: (args, ctx) => ctx.print(args.join(" ")),

    mkdir: (args, ctx) => {
      if (!args[0]) return ctx.print("mkdir: missing operand");
      const path = resolvePath(ctx.getCwd(), args[0]);
      const parent = getNode(ctx.fs, path.slice(0, path.lastIndexOf("/")) || "/");
      const name = path.slice(path.lastIndexOf("/") + 1);
      if (!parent || parent.type !== "dir") return ctx.print(`mkdir: cannot create directory '${args[0]}'`);
      if (parent.restricted) return ctx.print(`mkdir: cannot create directory '${args[0]}': Permission denied`);
      if (parent.children[name]) return ctx.print(`mkdir: cannot create directory '${args[0]}': File exists`);
      parent.children[name] = dir({});
    },

    touch: (args, ctx) => {
      if (!args[0]) return ctx.print("touch: missing file operand");
      const path = resolvePath(ctx.getCwd(), args[0]);
      const parent = getNode(ctx.fs, path.slice(0, path.lastIndexOf("/")) || "/");
      const name = path.slice(path.lastIndexOf("/") + 1);
      if (!parent || parent.type !== "dir" || parent.restricted)
        return ctx.print(`touch: cannot touch '${args[0]}': Permission denied`);
      if (!parent.children[name]) parent.children[name] = file("");
    },

    rm: (args, ctx) => {
      const flags = args.filter((a) => a.startsWith("-")).join("");
      const target = args.find((a) => !a.startsWith("-"));
      if (!target) return ctx.print("rm: missing operand");
      if (target === "/" || target === "-rf /" || (flags.includes("r") && target === "/"))
        return ctx.print(["rm: it is dangerous to operate recursively on '/'", "Nice try though. This portfolio keeps backups. 😏"]);
      const path = resolvePath(ctx.getCwd(), target);
      const parent = getNode(ctx.fs, path.slice(0, path.lastIndexOf("/")) || "/");
      const name = path.slice(path.lastIndexOf("/") + 1);
      if (!parent || parent.type !== "dir" || !parent.children[name])
        return ctx.print(`rm: cannot remove '${target}': No such file or directory`);
      if (parent.restricted || parent.children[name].restricted)
        return ctx.print(`rm: cannot remove '${target}': Permission denied`);
      if (parent.children[name].type === "dir" && !flags.includes("r"))
        return ctx.print(`rm: cannot remove '${target}': Is a directory`);
      delete parent.children[name];
    },

    whoami: (_a, ctx) => ctx.print("guest"),
    hostname: (_a, ctx) => ctx.print("error-found"),
    id: (_a, ctx) => ctx.print("uid=1001(guest) gid=1001(guest) groups=1001(guest)"),

    uname: (args, ctx) =>
      ctx.print(
        args.includes("-a")
          ? "Linux error-found 6.6.9-kali1-amd64 #1 SMP PREEMPT_DYNAMIC Kali 6.6.9 x86_64 GNU/Linux"
          : "Linux"
      ),

    date: (_a, ctx) => ctx.print(new Date().toString()),

    uptime: (_a, ctx) => {
      const mins = Math.floor((Date.now() - ctx.bootTime) / 60000);
      ctx.print(
        ` ${new Date().toTimeString().slice(0, 8)} up ${mins} min,  1 user,  load average: 0.13, 0.37, 1.33`
      );
    },

    ps: (_a, ctx) =>
      ctx.print([
        "  PID TTY          TIME CMD",
        "    1 ?        00:00:01 systemd",
        "  423 ?        00:00:00 NetworkManager",
        " 1337 pts/0    00:00:00 bash",
        " 2600 pts/0    00:13:37 ctf_grinder",
        " 4242 pts/0    00:00:00 ps",
      ]),

    free: (_a, ctx) =>
      ctx.print([
        "               total        used        free      shared  buff/cache   available",
        "Mem:            8192        1337        4855         242        2000        6613",
        "Swap:           2048           0        2048",
      ]),

    df: (_a, ctx) =>
      ctx.print([
        "Filesystem      Size  Used Avail Use% Mounted on",
        "/dev/nvme0n1p2  256G   42G  201G  18% /",
        "tmpfs           4.0G  1.3M  4.0G   1% /tmp",
        "/dev/sda1       1.0T  666G  358G  65% /mnt/loot",
      ]),

    ifconfig: (_a, ctx) =>
      ctx.print([
        "eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500",
        "        inet 10.0.2.15  netmask 255.255.255.0  broadcast 10.0.2.255",
        "        ether 08:00:27:13:37:00  txqueuelen 1000  (Ethernet)",
        "",
        "lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536",
        "        inet 127.0.0.1  netmask 255.0.0.0",
      ]),

    ping: async (args, ctx) => {
      const host = args.find((a) => !a.startsWith("-")) ?? "localhost";
      const ip = host === "localhost" || host === "127.0.0.1" ? "127.0.0.1" : fakeIp(host);
      ctx.print(`PING ${host} (${ip}) 56(84) bytes of data.`);
      const times: number[] = [];
      for (let i = 1; i <= 4; i++) {
        await sleep(650);
        const t = ip === "127.0.0.1" ? +(0.03 + Math.random() * 0.05).toFixed(3) : +(18 + Math.random() * 40).toFixed(1);
        times.push(t);
        ctx.print(`64 bytes from ${ip}: icmp_seq=${i} ttl=64 time=${t} ms`);
      }
      const min = Math.min(...times), max = Math.max(...times);
      const avg = +(times.reduce((a, b) => a + b, 0) / times.length).toFixed(3);
      ctx.print([
        "",
        `--- ${host} ping statistics ---`,
        "4 packets transmitted, 4 received, 0% packet loss, time 3004ms",
        `rtt min/avg/max/mdev = ${min}/${avg}/${max}/0.042 ms`,
      ]);
    },

    nmap: async (args, ctx) => {
      const target = args.find((a) => !a.startsWith("-"));
      if (!target || (target !== "localhost" && target !== "127.0.0.1" && target !== "scanme.nmap.org")) {
        return ctx.print([
          "Scan aborted: target is out of scope.",
          "Rule #1 of ethical hacking: only scan what you're authorized to.",
          "In-scope targets here: localhost, scanme.nmap.org",
        ]);
      }
      ctx.print(`Starting Nmap 7.94SVN ( https://nmap.org ) at ${new Date().toLocaleString()}`);
      await sleep(1200);
      ctx.print([
        `Nmap scan report for ${target} (${target === "scanme.nmap.org" ? "45.33.32.156" : "127.0.0.1"})`,
        "Host is up (0.00042s latency).",
        "Not shown: 996 closed tcp ports (conn-refused)",
        "PORT     STATE SERVICE",
        "22/tcp   open  ssh",
        "80/tcp   open  http",
        "443/tcp  open  https",
        "1337/tcp open  error_found-portfolio",
      ]);
      await sleep(400);
      ctx.print(["", "Nmap done: 1 IP address (1 host up) scanned in 1.62 seconds"]);
    },

    which: (args, ctx) => {
      if (!args[0]) return ctx.print("which: missing argument");
      ctx.print(COMMAND_NAMES.includes(args[0]) ? `/bin/${args[0]}` : `which: no ${args[0]} in (/usr/local/bin:/usr/bin:/bin)`);
    },

    man: (args, ctx) => {
      if (!args[0]) return ctx.print("What manual page do you want?\nFor example, try 'man man'.");
      const pages: Record<string, string> = {
        man: "man - an interface to the system reference manuals. You're looking at a web terminal; the real manual is the person who built it. Try 'about'.",
        sudo: "sudo - execute a command as another user. Spoiler: not today.",
        nmap: "nmap - Network exploration tool. Only scan authorized targets. Always.",
        neofetch: "neofetch - shows system info next to an ASCII logo, for maximum style points.",
      };
      ctx.print(pages[args[0]] ?? `No manual entry for ${args[0]}`);
    },

    history: (_a, ctx) => ctx.print(ctx.history.map((h, i) => `  ${String(i + 1).padStart(3)}  ${h}`)),

    sudo: (args, ctx) => {
      if (args.join(" ").includes("rm -rf /"))
        return ctx.print(["[sudo] password for guest: ", "Absolutely not. Reported to /var/log/auth.log. 🚨"]);
      ctx.print([
        "[sudo] password for guest: ",
        "guest is not in the sudoers file.",
        "This incident will be reported.",
      ]);
    },

    neofetch: (_a, ctx) => {
      const mins = Math.floor((Date.now() - ctx.bootTime) / 60000);
      const info = [
        "guest@error-found",
        "─────────────────",
        "OS: Kali GNU/Linux Rolling x86_64",
        "Kernel: 6.6.9-kali1-amd64",
        `Uptime: ${mins} min${mins === 1 ? "" : "s"}`,
        "Shell: bash 5.2.21 (web edition)",
        "Terminal: error_found tty1",
        "CPU: Caffeine Core i9 @ 4.20GHz",
        "Memory: 1337MiB / 8192MiB",
        `Operator: ${profile.name} (${profile.brand})`,
      ];
      const out: string[] = [];
      const rows = Math.max(NEOFETCH_LOGO.length, info.length);
      for (let i = 0; i < rows; i++) {
        out.push(`${NEOFETCH_LOGO[i] ?? " ".repeat(20)}  ${info[i] ?? ""}`);
      }
      ctx.print(out);
    },

    clear: (_a, ctx) => ctx.clear(),

    exit: (_a, ctx) => ctx.print(["logout", "...just kidding. There's no escape from the portfolio. 🙂"]),

    /* ------------------------- portfolio commands ------------------------- */

    about: (_a, ctx) => ctx.print([profile.name, profile.title, "", ...wrap(profile.bio).split("\n")]),

    skills: (_a, ctx) =>
      ctx.print(skillCategories.flatMap((c) => [`${c.label}:`, `  ${c.skills.join(", ")}`])),

    education: (_a, ctx) =>
      ctx.print(education.flatMap((e) => [e.institution, `  ${e.degree} (${e.period})`])),

    projects: (_a, ctx) =>
      ctx.print([...projects.map((p) => `- ${p.title}`), "", "Hint: cat ~/projects/<name>.md for details"]),

    certifications: (_a, ctx) => ctx.print(certifications.map((c) => `- [${c.issuer}] ${c.name}`)),

    achievements: (_a, ctx) => ctx.print(achievements.map((a) => `- ${a.title}`)),

    contact: (_a, ctx) =>
      ctx.print([
        `Email    : ${profile.email}`,
        `Phone    : ${profile.phone}`,
        `Location : ${profile.location}`,
        `GitHub   : ${profile.github}`,
        `LinkedIn : ${profile.linkedin}`,
      ]),

    resume: (_a, ctx) => {
      ctx.print("Downloading resume.pdf ...");
      download();
    },

    banner: (_a, ctx) => ctx.print(BANNER),
  };
  return handlers;
}

/* -------------------------------- component ------------------------------- */

export default function Terminal() {
  const [lines, setLines] = useState<Line[]>(BANNER.map((text) => ({ type: "output", text })));
  const [input, setInput] = useState("");
  const [cwd, setCwdState] = useState(HOME);
  const [busy, setBusy] = useState(false);
  const [historyIdx, setHistoryIdx] = useState<number | null>(null);

  const fsRef = useRef<FSNode>(buildFS());
  const cwdRef = useRef(cwd);
  const commandHistory = useRef<string[]>([]);
  const bootTime = useRef(Date.now());
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const handlersRef = useRef<Record<string, Handler> | null>(null);

  if (!handlersRef.current) {
    handlersRef.current = makeHandlers(() => {
      const a = document.createElement("a");
      a.href = profile.resumeUrl;
      a.download = "Aayush-Paudel-Resume.pdf";
      a.click();
    });
  }

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [lines, busy]);

  const promptFor = (path: string) => `guest@error-found:${displayPath(path)}$`;

  function makeCtx(): Ctx {
    return {
      print: (l) => {
        const arr = Array.isArray(l) ? l : [l];
        setLines((prev) => [...prev, ...arr.flatMap((t) => t.split("\n")).map((text) => ({ type: "output" as const, text }))]);
      },
      clear: () => setLines([]),
      getCwd: () => cwdRef.current,
      setCwd: (p) => {
        cwdRef.current = p;
        setCwdState(p);
      },
      fs: fsRef.current,
      history: commandHistory.current,
      bootTime: bootTime.current,
    };
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (busy) return;
    const raw = input;
    const prompt = promptFor(cwdRef.current);
    setLines((prev) => [...prev, { type: "input", text: raw, prompt }]);
    setInput("");
    setHistoryIdx(null);

    const trimmed = raw.trim();
    if (!trimmed) return;
    commandHistory.current.push(trimmed);

    const [cmd, ...args] = trimmed.split(/\s+/);
    const handler = handlersRef.current?.[cmd.toLowerCase()];
    const ctx = makeCtx();

    if (!handler) {
      ctx.print([`bash: ${cmd}: command not found`, "Type 'help' for available commands."]);
      return;
    }

    const result = handler(args, ctx);
    if (result instanceof Promise) {
      setBusy(true);
      try {
        await result;
      } finally {
        setBusy(false);
        requestAnimationFrame(() => inputRef.current?.focus());
      }
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      const hist = commandHistory.current;
      if (hist.length === 0) return;
      const nextIdx = historyIdx === null ? hist.length - 1 : Math.max(0, historyIdx - 1);
      setHistoryIdx(nextIdx);
      setInput(hist[nextIdx]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const hist = commandHistory.current;
      if (historyIdx === null) return;
      const nextIdx = historyIdx + 1;
      if (nextIdx >= hist.length) {
        setHistoryIdx(null);
        setInput("");
      } else {
        setHistoryIdx(nextIdx);
        setInput(hist[nextIdx]);
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      const parts = input.split(/\s+/);
      const last = parts[parts.length - 1] ?? "";
      let candidates: string[];
      if (parts.length <= 1) {
        candidates = COMMAND_NAMES.filter((c) => c.startsWith(last));
      } else {
        const slash = last.lastIndexOf("/");
        const dirPart = slash >= 0 ? last.slice(0, slash + 1) : "";
        const namePart = slash >= 0 ? last.slice(slash + 1) : last;
        const dirNode = getNode(fsRef.current, resolvePath(cwdRef.current, dirPart || "."));
        if (!dirNode || dirNode.type !== "dir" || dirNode.restricted) return;
        candidates = Object.keys(dirNode.children)
          .filter((n) => n.startsWith(namePart))
          .map((n) => dirPart + n + (dirNode.children[n].type === "dir" ? "/" : ""));
      }
      if (candidates.length === 1) {
        parts[parts.length - 1] = candidates[0];
        setInput(parts.join(" ") + (candidates[0].endsWith("/") ? "" : " "));
      } else if (candidates.length > 1) {
        setLines((prev) => [
          ...prev,
          { type: "input", text: input, prompt: promptFor(cwdRef.current) },
          { type: "output", text: candidates.map((c) => c.replace(/\/$/, "")).join("  ") },
        ]);
      }
    } else if (e.key === "c" && e.ctrlKey) {
      setInput("");
      setHistoryIdx(null);
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      setLines([]);
    }
  }

  return (
    <section id="terminal" className="relative mx-auto max-w-6xl px-5 py-24">
      <SectionHeading
        index="06"
        slug="terminal"
        title="Interactive Terminal"
        subtitle="A real shell with a virtual filesystem. ls around, cat files, ping something — see what you find."
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5 }}
        className="gradient-border overflow-hidden rounded-2xl border border-border"
        onClick={() => inputRef.current?.focus()}
      >
        <div className="flex items-center gap-2 border-b border-border bg-bg-elevated-2 px-4 py-3">
          <span className="h-3 w-3 rounded-full bg-danger/70" />
          <span className="h-3 w-3 rounded-full bg-yellow-500/70" />
          <span className="h-3 w-3 rounded-full bg-primary/70" />
          <span className="ml-3 flex items-center gap-1.5 font-mono-tight text-xs text-text-dim">
            <TerminalSquare size={14} aria-hidden="true" />
            guest@error-found: {displayPath(cwd)}
          </span>
        </div>

        <div
          ref={scrollRef}
          className="h-96 overflow-y-auto bg-bg px-5 py-4 font-mono-tight text-sm leading-relaxed"
        >
          {lines.map((line, i) => (
            <div
              key={i}
              className={line.type === "input" ? "text-secondary" : "whitespace-pre-wrap text-text-dim"}
            >
              {line.type === "input" ? (
                <>
                  <span className="text-primary">{line.prompt.slice(0, line.prompt.indexOf(":"))}</span>
                  <span className="text-text-dim">{line.prompt.slice(line.prompt.indexOf(":"))} </span>
                  {line.text}
                </>
              ) : (
                line.text
              )}
            </div>
          ))}

          {!busy && (
            <form onSubmit={handleSubmit} className="mt-1 flex items-center gap-2">
              <label htmlFor="terminal-input" className="sr-only">
                Terminal command input
              </label>
              <span className="whitespace-nowrap">
                <span className="text-primary">guest@error-found</span>
                <span className="text-text-dim">:{displayPath(cwd)}$</span>
              </span>
              <input
                id="terminal-input"
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                autoComplete="off"
                autoCapitalize="off"
                spellCheck={false}
                className="flex-1 bg-transparent text-text outline-none"
                aria-label="Terminal command input"
              />
            </form>
          )}
          {busy && <div className="animate-pulse text-text-dim">▍</div>}
        </div>
      </motion.div>
    </section>
  );
}
