const BASE_WORKER_DIR = process.env.BASE_WORKER_DIR || "/tmp/aiagent-worker";
if (!Bun.file(BASE_WORKER_DIR).exists()) {
  Bun.write(BASE_WORKER_DIR, ""); // dir create
}

export async function onFileUpdate(filePath: string, fileContent: string) {
  await Bun.write(`${BASE_WORKER_DIR}/${filePath}`, fileContent);
}

export function onShellCommand(shellCommand: string) {
  const commands = shellCommand.split("&&");
  for (const command of commands) {
    console.log("running command: ", command);
    const result = Bun.spawnSync({
      cmd: command.split(" "),
      cwd: BASE_WORKER_DIR,
    });
    console.log(result.stdout);
    console.log(result.stderr.toString());
  }
}
